import multer from 'multer';

const storage = multer.memoryStorage(); // Change diskStorage to memoryStorage
const upload = multer({ storage });

export default upload;
