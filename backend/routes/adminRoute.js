import express from 'express'
import { addAdmin, addTeacher, adminLogin, fetchAdminData, searchTeacher, updateTeacher, deleteTeacher, fetchStudents, updateStudentApprovalStatus } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'


const adminRouter = express.Router()

adminRouter.post('/add-admin', upload.single('image'), addAdmin);
adminRouter.post('/admin-login', adminLogin);
adminRouter.get('/profile', fetchAdminData);

adminRouter.post('/add-teacher', upload.single('image'), addTeacher)
adminRouter.get("/search-teacher", searchTeacher);
adminRouter.patch("/update-teacher/:email", upload.single("image"), updateTeacher);


adminRouter.delete("/delete-teacher/:email", deleteTeacher);

adminRouter.get('/approve-student', fetchStudents);
adminRouter.patch("/approve-student/:id", updateStudentApprovalStatus);



export default adminRouter