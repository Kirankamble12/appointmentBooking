import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    image: { type: String, required: true }, // Profile Image URL (Stored in Cloudinary)
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    qualification: { type: String, required: true },
    department: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // ✅ Unique Email for Teacher
    mobile: { type: String, required: true },
    password: { type: String, required: true },

    // Availability for Appointment
    availability: { type: Boolean, default: true }, // TRUE = Available, FALSE = Not Available

    // Appointment Scheduling (Flexible Booking)
    appointments: [{
        studentEmail: { type: String, required: true }, // ✅ Store Student's Email Instead of Object ID
        date: { type: Date, required: true }, // Appointment Date
        time: { type: String, required: true }, // Appointment Time
        status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" } // Appointment Status
    }],

    // Messaging (Send & Receive)
    messages: [{
        senderEmail: { type: String, required: true }, // ✅ Sender Email (Admin or Student)
        receiverEmail: { type: String, required: true }, // ✅ Receiver Email (Teacher)
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
