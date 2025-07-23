import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import teacherModel from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";
import dotenv from "dotenv";


dotenv.config(); // ✅ Load environment variables

const teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login Request Received:", req.body);

        // ✅ Validate missing fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // ✅ Find teacher in MongoDB
        const teacher = await teacherModel.findOne({ email });

        if (!teacher) {
            return res.status(400).json({ success: false, message: "Invalid Email!" });
        }

        // ✅ Validate password
        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect Password!" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ email: teacher.email }, "your_secret_key", { expiresIn: "2h" });

        console.log("Profile Image Sent:", teacher.profileImage); // ✅ Debugging output

        res.status(200).json({ success: true, message: "Login successful!", teacher, token });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, message: "Error during login!", error: error.message });
    }
};

//for forget-password 

const resetTeacherPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const teacher = await teacherModel.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" })
        }

        //hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        teacher.password = hashedPassword;
        await teacher.save();

        return res.status(200).json({ success: true, message: " The Password is reset" });
    }
    catch (error) {
        console.error("error resetting Password", error.message)
        return res.status(500).json({ success: false, message: "Internal server error" });
    };
}
//for fetching teacher data
const fetchTeacherData = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required!" });
        }

        // ✅ Find teacher in MongoDB
        const teacher = await teacherModel.findOne({ email });

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        console.log("Fetched Teacher Data:", teacher); // ✅ Debugging output

        res.status(200).json({
            success: true,
            teacher: {
                name: teacher.name,
                email: teacher.email,
                department: teacher.department,
                subject: teacher.subject,
                image: teacher.image || "https://via.placeholder.com/100", // ✅ Ensure image is always returned
            }
        });
    } catch (error) {
        console.error("Error fetching teacher data:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};




// ✅ Fetch Messages for a Teacher using Email  from student
export const getTeacherMessages = async (req, res) => {
    try {
        const { email } = req.params;
        const teacher = await teacherModel.findOne({ email });


        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        // ✅ Filter Messages Where `receiverEmail` Matches the Teacher Email
        const teacherMessages = teacher.messages.filter(msg => msg.receiverEmail === email);

        res.status(200).json({ success: true, messages: teacherMessages });
    } catch (error) {
        console.error("Error fetching teacher messages:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

//  Reply to Message (Teacher → Student) using Email
export const replyToStudentMessage = async (req, res) => {
    try {
        const { teacherEmail, studentEmail, message, timestamp } = req.body;  // ✅ Include 'timestamp'
        console.log("Received Request Body:", JSON.stringify(req.body, null, 2));


        if (!teacherEmail || !studentEmail || !message || !timestamp) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Fetch Teacher & Student from Database
        const teacher = await teacherModel.findOne({ email: teacherEmail });
        const student = await studentModel.findOne({ email: studentEmail });

        if (!student || !teacher) {
            return res.status(404).json({ success: false, message: "Student or Teacher not found!" });
        }

        // ✅ Store reply as a new message, linking it to the original message via timestamp
        const newMessage = {
            senderEmail: teacherEmail,  // ✅ Teacher as sender
            receiverEmail: studentEmail,  // ✅ Student as receiver
            message: message,  // ✅ Store reply as a regular message
            timestamp: timestamp, // ✅ Ensure timestamp matches original message
        };

        // Save Reply as a New Message
        student.messages.push(newMessage);
        teacher.messages.push(newMessage);

        await student.save();
        await teacher.save();

        res.status(200).json({ success: true, message: "Message sent successfully!", messageData: newMessage });

    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
//view all appointment also approve and reject



export const manageTeacherAppointments = async (req, res) => {
    try {
        console.log("Received Body:", req.body);  // ✅ Debug incoming request data

        const { teacherEmail } = req.params;

        if (!teacherEmail) {
            return res.status(400).json({ success: false, message: "Teacher email is missing in URL!" });
        }

        const teacher = await teacherModel.findOne({ email: teacherEmail });

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        if (req.method === "GET") {
            return res.status(200).json({ success: true, appointments: teacher.appointments });
        }

        // ✅ Fix Date Format Before Searching
        const formattedDate = new Date(req.body.date).toISOString().split("T")[0];
        const formattedTime = req.body.time.trim().toLowerCase();

        // ✅ Find Appointment
        const appointment = teacher.appointments.find(appt =>
            appt.studentEmail === req.body.studentEmail &&
            new Date(appt.date).toISOString().split("T")[0] === formattedDate &&
            appt.time.trim().toLowerCase() === formattedTime
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found!" });
        }

        // ✅ Update Appointment
        appointment.status = req.body.status;
        await teacher.save();

        return res.status(200).json({ success: true, message: `Appointment updated to ${req.body.status}` });

    } catch (error) {
        console.error("Error managing appointments:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//schedule appointmet with students


export const scheduleAppointment = async (req, res) => {
    try {
        console.log("Received Body:", req.body);  // ✅ Debug incoming request data

        const { studentEmail, date, time } = req.body;
        const { teacherEmail } = req.params;

        // ✅ Validate Required Fields
        if (!studentEmail || !date || !time || !teacherEmail) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        // ✅ Find Teacher
        const teacher = await teacherModel.findOne({ email: teacherEmail });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        // ✅ Find Student (Ensure Student Exists)
        const student = await studentModel.findOne({ email: studentEmail });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        // ✅ Format Date Correctly
        const formattedDate = new Date(date).toISOString();

        // ✅ Create Appointment Entry (Automatically "Confirmed")
        const newAppointment = {
            studentEmail,
            teacherEmail,
            date: formattedDate,
            time,
            status: "Confirmed" // ✅ Automatically mark as "Confirmed"
        };

        // ✅ Save in Both Teacher & Student Database
        teacher.appointments.push(newAppointment);
        student.appointments.push(newAppointment);

        await teacher.save();
        await student.save();

        return res.status(201).json({ success: true, message: "Appointment scheduled and confirmed successfully!", appointment: newAppointment });
    } catch (error) {
        console.error("Error scheduling appointment:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//view all the appointment schedule by teacher and student(confirmed)


export const getConfirmedAppointments = async (req, res) => {
    try {
        const { teacherEmail } = req.params;

        // ✅ Validate Required Fields
        if (!teacherEmail) {
            return res.status(400).json({ success: false, message: "Missing teacher email!" });
        }

        // ✅ Find Teacher
        const teacher = await teacherModel.findOne({ email: teacherEmail });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        // ✅ Filter Confirmed Appointments (Includes Student-Scheduled & Teacher-Scheduled)
        const confirmedAppointments = teacher.appointments.filter(appt => appt.status === "Confirmed");

        return res.status(200).json({ success: true, appointments: confirmedAppointments });
    } catch (error) {
        console.error("Error fetching confirmed appointments:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};





export { teacherLogin, fetchTeacherData, resetTeacherPassword };
