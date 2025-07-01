import express from "express";
import { teacherLogin, fetchTeacherData, getTeacherMessages, replyToStudentMessage, manageTeacherAppointments, scheduleAppointment, getConfirmedAppointments } from "../controllers/teacherController.js";


const teacherRouter = express.Router();

teacherRouter.post("/teacher-login", teacherLogin); // ✅ Login API
teacherRouter.get("/teacher-profile", fetchTeacherData);

teacherRouter.get("/teacher/:email", getTeacherMessages);
teacherRouter.post("/reply", replyToStudentMessage);

teacherRouter.route("/appointments/:teacherEmail")
    .get(manageTeacherAppointments)  // ✅ Fetch all appointments (with student details)
    .put(manageTeacherAppointments);

teacherRouter.post("/schedule-appointment/:teacherEmail", scheduleAppointment);
teacherRouter.get("/confirmed-appointments/:teacherEmail", getConfirmedAppointments);
export default teacherRouter;
