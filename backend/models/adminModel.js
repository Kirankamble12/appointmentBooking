import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    image: { type: String, required: true },
    adminid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mob: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema);
export default adminModel;
