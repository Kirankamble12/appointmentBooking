import validator from "validator";
import adminModel from "../models/adminModel.js";
import teacherModel from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const addAdmin = async (req, res) => {
    try {
        const { adminid, name, email, mob, password, conpassword } = req.body;
        const image = req.file; // Get uploaded image file

        console.log("Received Data from Frontend:", req.body);
        console.log("Received Image File:", image);

        //  Validate if image is correctly received
        if (!image || !image.buffer) {
            return res.status(400).json({ success: false, message: "No image file provided!" });
        }

        //  Validate missing fields
        if (!adminid || !name || !email || !mob || !password || !conpassword) {
            return res.status(400).json({ success: false, message: "Missing details!" });
        }

        //  Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email" });
        }

        //  Validate strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Enter a strong password (at least 8 characters)" });
        }

        //  Ensure password and confirm password match
        if (password !== conpassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match!" });
        }

        //  Check if admin already exists
        const existingAdmin = await adminModel.findOne({ $or: [{ email }, { adminid }] });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin with this email or ID already exists!" });
        }

        // Hash admin password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        let imageUrl = "";

        //  Upload Image to Cloudinary with increased timeout
        const uploadImageToCloudinary = async (imageBuffer) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "image", timeout: 60000 }, // Increased timeout
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

        //  Prepare admin data with image URL
        const adminData = {
            adminid,
            name,
            email,
            mob,
            password: hashPassword,
            image: imageUrl, // Save Cloudinary image URL
        };

        //  Save admin in the database
        const newAdmin = new adminModel(adminData);
        await newAdmin.save();

        res.status(201).json({ success: true, message: "Admin added successfully!", admin: newAdmin });

    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ success: false, message: "Error adding admin!", error: error.message });
    }
};

// Admin Login Function
const adminLogin = async (req, res) => {
    try {
        const { adminid, email, password } = req.body;

        console.log("Login Request Received:", req.body);

        if (!adminid || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const admin = await adminModel.findOne({ email, adminid });
        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid Admin ID or Email!" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect Password!" });
        }

        res.status(200).json({ success: true, message: "Login successful!", admin });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, message: "Error during login!", error: error.message });
    }
};
//for fetching the admin data 
const fetchAdminData = async (req, res) => {
    try {
        const { email } = req.query; // Fetch admin based on email

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required!" });
        }

        // Find admin in MongoDB
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found!" });
        }

        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};

//for Adding Teacher


const addTeacher = async (req, res) => {
    try {
        const { name, gender, dob, qualification, department, subject, email, mobile, password, conpassword } = req.body;
        const image = req.file;

        console.log("Received Data:", req.body);
        console.log("Received Image File:", image);

        // ✅ Validate input fields
        if (!name || !gender || !dob || !qualification || !department || !subject || !email || !mobile || !password || !conpassword) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format!" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long!" });
        }

        if (password !== conpassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match!" });
        }

        //  Check if teacher exists
        const existingTeacher = await teacherModel.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ success: false, message: "Teacher with this email already exists!" });
        }

        //  Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        let imageUrl = "";

        // Upload image to Cloudinary
        if (!image || !image.buffer) {
            return res.status(400).json({ success: false, message: "No image file provided!" });
        }

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
        console.log("Uploaded Image URL:", imageUrl);

        //  Save teacher data in database
        const newTeacher = new teacherModel({
            name,
            gender,
            dob,
            qualification,
            department,
            subject,
            email,
            mobile,
            password: hashPassword,
            image: imageUrl
        });

        await newTeacher.save();

        res.status(201).json({ success: true, message: "Teacher added successfully!", teacher: newTeacher });

    } catch (error) {
        console.error("Error adding teacher:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};



// Search Teacher by Name or Email
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
        console.error("Error searching teacher:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Update Teacher Details
export const updateTeacher = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, gender, dob, qualification, department, subject, mobile, password, conpassword, image } = req.body;

        // Check if teacher exists
        const teacher = await teacherModel.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        // If password is provided, hash it
        let hashedPassword = teacher.password;
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ success: false, message: "Password must be at least 8 characters!" });
            }
            if (password !== conpassword) {
                return res.status(400).json({ success: false, message: "Passwords do not match!" });
            }

            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }
        //  Upload new image to Cloudinary if provided
        let imageUrl = teacher.image;
        if (req.file) {
            try {
                const cloudinaryResponse = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: "image" },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload failed:", error);
                                reject(new Error("Image upload error"));
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });

                imageUrl = cloudinaryResponse.secure_url;
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        }




        // Update teacher details
        const updatedTeacher = await teacherModel.findOneAndUpdate(
            { email },
            { name, gender, dob, qualification, department, subject, mobile, password: hashedPassword, image: imageUrl },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Teacher updated successfully!", teacher: updatedTeacher });

    } catch (error) {
        console.error("Error updating teacher:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
    try {
        const { email } = req.params;

        // Check if teacher exists
        const teacher = await teacherModel.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found!" });
        }

        await teacherModel.deleteOne({ email });
        res.status(200).json({ success: true, message: "Teacher deleted successfully!" });

    } catch (error) {
        console.error("Error deleting teacher:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


//for approving student 
const fetchStudents = async (req, res) => {
    try {
        const students = await studentModel.find(); //  Fetch all students for admin view

        if (!students.length) {
            return res.status(404).json({ success: false, message: "No students found!" });
        }

        console.log("Fetched Student Data (Admin View):", students); //  Debugging output

        res.status(200).json({ success: true, students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};


//  Approve Student Registration
const updateStudentApprovalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;

        if (typeof isApproved !== "boolean") {
            return res.status(400).json({ success: false, message: "Invalid approval status!" });
        }

        const student = await studentModel.findByIdAndUpdate(id, { isApproved }, { new: true });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        res.status(200).json({ success: true, message: `Student ${isApproved ? "approved" : "rejected"} successfully!`, student });
    } catch (error) {
        console.error(`Error updating student approval status:`, error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};





export { addAdmin, adminLogin, fetchAdminData, addTeacher, fetchStudents, updateStudentApprovalStatus };


