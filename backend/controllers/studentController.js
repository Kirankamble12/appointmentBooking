import bcrypt from "bcrypt";
import validator from "validator";
import studentModel from "../models/studentModel.js";
import teacherModel from "../models/teacherModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const registerStudent = async (req, res) => {
    try {
        const { studentId, name, gender, dob, department, year, email, password, confirmPassword } = req.body;
        const image = req.file;

        console.log("Received Student Data:", req.body);
        console.log("Received Image File:", image);

        // ✅ Validate missing fields
        if (!studentId || !name || !gender || !dob || !department || !year || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // ✅ Validate email format using validator.js
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email!" });
        }

        // ✅ Validate strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long!" });
        }

        // ✅ Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match!" });
        }

        // ✅ Check if student already exists
        const existingStudent = await studentModel.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: "Student with this email already exists!" });
        }

        // ✅ Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        let imageUrl = "";

        // ✅ Upload Image to Cloudinary if provided
        if (image && image.buffer) {
            const uploadImageToCloudinary = async (imageBuffer) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: "image", timeout: 60000 },
                        (error, result) => {
                            if (error) {
                                reject(new Error("Cloudinary upload failed: " + error.message));
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    ).end(imageBuffer);
                });
            };

            imageUrl = await uploadImageToCloudinary(image.buffer);
            console.log("Cloudinary Image URL:", imageUrl);
        }

        // ✅ Save student in the database
        const newStudent = new studentModel({
            studentId,
            name,
            gender,
            dob,
            department,
            year,
            email,
            password: hashPassword,
            profileImage: imageUrl,
        });

        await newStudent.save();

        // ✅ Redirect student after registration
        res.status(201).json({ success: true, message: "Student registered successfully!", student: newStudent });

    } catch (error) {
        console.error("Error registering student:", error);
        res.status(500).json({ success: false, message: "Error registering student!", error: error.message });
    }
};

// ✅ Student Login 
const studentLogin = async (req, res) => {
    try {
        const { studentId, email, password } = req.body;

        console.log("Login Request Received:", req.body);

        // ✅ Validate missing fields
        if (!studentId || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // ✅ Find student in MongoDB
        const student = await studentModel.findOne({ email, studentId });

        if (!student) {
            return res.status(400).json({ success: false, message: "Invalid Student ID or Email!" });
        }

        // ✅ Validate password
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect Password!" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ studentId: student.studentId, email: student.email }, "your_secret_key", { expiresIn: "2h" });

        res.status(200).json({ success: true, message: "Login successful!", student, token });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, message: "Error during login!", error: error.message });
    }
};

//for forget password

export const resetPassword = async (req, res) => {
    try {
        const { studentId, email, newPassword } = req.body;

        // ✅ Check if student exists
        const student = await studentModel.findOne({ studentId, email });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        // ✅ Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;
        await student.save();

        return res.status(200).json({ success: true, message: "Password reset successful!" });

    } catch (error) {
        console.error("Error resetting password:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



//view student profile
const fetchStudentProfile = async (req, res) => {
    try {
        const { email } = req.query; // ✅ Fetch student based on email

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required!" });
        }

        // ✅ Find student in MongoDB
        const student = await studentModel.findOne({ email });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        console.log("Fetched Student Data:", student); // ✅ Debugging output

        res.status(200).json({ success: true, student });
    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};

export const searchTeacher = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required!" });
        }


        const teacher = await teacherModel.findOne({
            $or: [{ name: query }, { email: query }]
        });

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        res.status(200).json({ success: true, teacher });
    } catch (error) {
        console.error("Error searching teacher:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


//  Fetch Messages for a Student using Email from teacher
export const getStudentMessages = async (req, res) => {
    try {
        const { email } = req.params;
        const student = await studentModel.findOne({ email });  // ✅ Use 'studentModel'

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        res.status(200).json({ success: true, messages: student.messages });
    } catch (error) {
        console.error("Error fetching student messages:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// ✅ Send Message (Student → Teacher) using Email
export const sendMessageToTeacher = async (req, res) => {
    try {
        const { studentEmail, teacherEmail, message } = req.body;

        console.log("Received Message Data:", { studentEmail, teacherEmail, message }); // ✅ Debugging step

        if (!studentEmail || !teacherEmail || !message) {
            console.log("Missing fields in request body"); // ✅ Log missing fields
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const student = await studentModel.findOne({ email: studentEmail });  // ✅ Use studentModel
        const teacher = await teacherModel.findOne({ email: teacherEmail });  // ✅ Use teacherModel

        if (!student || !teacher) {
            console.log("Student or Teacher not found"); // ✅ Debugging step
            return res.status(404).json({ success: false, message: "Student or Teacher not found!" });
        }

        student.messages.push({ senderEmail: studentEmail, receiverEmail: teacherEmail, message });
        await student.save();

        teacher.messages.push({ senderEmail: studentEmail, receiverEmail: teacherEmail, message });
        await teacher.save();

        res.status(200).json({ success: true, message: "Message sent successfully!" });

    } catch (error) {
        console.error("Error sending message:", error.message); // ✅ Log error message
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

//  Book Appointment Logic
export const bookAppointment = async (req, res) => {
    try {
        const { studentEmail, teacherEmail, date, time } = req.body;

        console.log("Received Booking Request:", req.body);

        if (!studentEmail || !teacherEmail || !date || !time) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // ✅ Find Student & Teacher
        const student = await studentModel.findOne({ email: studentEmail });
        const teacher = await teacherModel.findOne({ email: teacherEmail });

        if (!student || !teacher) {
            return res.status(404).json({ success: false, message: "Student or Teacher not found!" });
        }

        // ✅ Create Appointment Entry (Without Purpose)
        const newAppointment = {
            teacherEmail,
            studentEmail,
            date,
            time,
            status: "Pending", // ✅ Default status
        };

        // ✅ Store Appointment in Both Models
        student.appointments.push(newAppointment);
        teacher.appointments.push(newAppointment);

        await student.save();
        await teacher.save();

        res.status(200).json({ success: true, message: "Appointment booked successfully!", appointmentData: newAppointment });

    } catch (error) {
        console.error("Error booking appointment:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
// to view all my appointments


export const getStudentAppointments = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        const student = await studentModel.findOne({ email: studentEmail });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        // ✅ Fetch teacher details for each appointment
        const appointmentsWithDetails = await Promise.all(student.appointments.map(async (appt) => {
            const teacher = await teacherModel.findOne({ email: appt.teacherEmail });

            if (teacher) {
                // ✅ Ensure we fetch the latest status from the teacher's record
                const teacherAppointment = teacher.appointments.find(tAppt =>
                    tAppt.studentEmail === studentEmail &&
                    new Date(tAppt.date).toISOString().split("T")[0] === new Date(appt.date).toISOString().split("T")[0] &&
                    tAppt.time.trim().toLowerCase() === appt.time.trim().toLowerCase()
                );

                return {
                    teacherName: teacher.name,
                    teacherEmail: teacher.email,
                    department: teacher.department,
                    subject: teacher.subject,
                    date: appt.date,
                    time: appt.time,
                    status: teacherAppointment ? teacherAppointment.status : appt.status // ✅ Update status from teacher side
                };
            }

            return null;
        }));

        res.status(200).json({ success: true, appointments: appointmentsWithDetails.filter(appt => appt !== null) });

    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



export { registerStudent, studentLogin, fetchStudentProfile };
