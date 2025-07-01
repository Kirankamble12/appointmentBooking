import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true }, // ✅ Unique student ID
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // ✅ Unique email for Student
    password: { type: String, required: true }, // ✅ Will be hashed
    profileImage: { type: String, required: false }, // ✅ Profile Image URL

    // Approval Status (Admin must approve)
    isApproved: { type: Boolean, default: false }, // FALSE = Not Approved, TRUE = Approved

    // Appointments (Between Student & Teacher)
    appointments: [{
        teacherEmail: { type: String, required: true }, // ✅ Store Teacher's Email Instead of Object ID
        date: { type: Date, required: true }, // Appointment Date
        time: { type: String, required: true }, // Appointment Time
        status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" } // Appointment Status
    }],

    // Messaging (Between Student & Teacher using Email)
    messages: [{
        senderEmail: { type: String, required: true }, // ✅ Sender Email (Student)
        receiverEmail: { type: String, required: true }, // ✅ Receiver Email (Teacher)
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
