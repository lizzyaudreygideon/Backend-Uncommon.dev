// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/students';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }
});

// Route to create a student (one at a time)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { username, school, hub, age, gender, email } = req.body;

    // Check if the required fields are present
    if (!username || !school || !hub || !age || !email) {
      return res.status(400).json({ message: 'Please provide all required fields: username, school, hub, age, and email.' });
    }

    // Prepare the student data
    const studentData = {
      username,
      school,
      hub,
      age,
      gender: gender || '',
      email,
      image: req.file ? req.file.path : null
    };

    // Create the student
    const newStudent = await studentController.createStudent(studentData);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      message: 'Error creating student',
      error: error.message
    });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await studentController.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Export the routes
module.exports = router;
