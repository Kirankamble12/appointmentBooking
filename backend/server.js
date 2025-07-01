import express from 'express';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import teacherRouter from './routes/teacherRoute.js';
import events from 'events';
import studentRouter from './routes/studentRoute.js';

// Load environment variables
dotenv.config();

// Increase default event listener limit
events.EventEmitter.defaultMaxListeners = 20;

// Ensure 'uploads' folder exists before using Multer
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Connect to Cloudinary
connectCloudinary();

// Verify Cloudinary credentials
console.log("Cloudinary Config:", process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_SECRET_KEY);

// Middlewares
app.use(express.json({ limit: "50mb" })); // Increase JSON payload size limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin: "http://localhost:5173",  //  Allow requests from frontend
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], //  Explicitly allow PATCH
    allowedHeaders: ["Content-Type"]
}));

// API Endpoint
app.get('/', (req, res) => {
    res.send('API is running successfully!');
});

// Admin Routes
app.use('/api/admin', adminRouter); // Mount admin routes
app.use('/api/teacher', teacherRouter);
app.use('/api/student', studentRouter);

// Global Error Handling
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// Start the Express App
app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
