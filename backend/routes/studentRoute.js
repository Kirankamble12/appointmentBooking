import express from "express";
import { fetchStudentProfile, registerStudent, studentLogin, searchTeacher, getStudentMessages, sendMessageToTeacher, bookAppointment, getStudentAppointments, resetPassword } from "../controllers/studentController.js";
import upload from "../middleware/multer.js";

const studentRouter = express.Router();

// ✅ Student Registration Route
studentRouter.post("/student-register", upload.single('profileImage'), registerStudent);
studentRouter.post("/student-login", studentLogin);
studentRouter.post("/reset-password", resetPassword);


studentRouter.post("/student-profile", fetchStudentProfile);

studentRouter.get("/search-teacher", searchTeacher);

studentRouter.get("/:email", getStudentMessages);
studentRouter.post("/send", sendMessageToTeacher);

studentRouter.post("/book-appointment/:teacherEmail", bookAppointment);
studentRouter.get("/my-appointments/:studentEmail", getStudentAppointments);


export default studentRouter;
