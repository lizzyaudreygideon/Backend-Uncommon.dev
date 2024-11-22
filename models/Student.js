// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentService = require('../controllers/studentController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/students/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Create new student
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received Body:', req.body);
    console.log('Received File:', req.file);

    const requiredFields = [
      'name',
      'school',
      'help_hub',
      'current_game'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Required fields are missing',
        missingFields: missingFields
      });
    }

    const studentData = { ...req.body };
    if (req.file) {
      studentData.image = req.file.path;
    }

    const newStudent = await studentService.createStudent(studentData);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Student creation error:', error);
    res.status(500).json({
      message: 'Error creating student',
      error: error.message
    });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching student',
      error: error.message
    });
  }
});

// Update student
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const studentData = { ...req.body };
    if (req.file) {
      studentData.image = req.file.path;
    }

    const updatedStudent = await studentService.updateStudent(req.params.id, studentData);
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating student',
      error: error.message
    });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting student',
      error: error.message
    });
  }
});

// Filter students
router.post('/filter', async (req, res) => {
  try {
    const students = await studentService.filterStudents(req.body);
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: 'Error filtering students',
      error: error.message
    });
  }
});

module.exports = router;

// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required']
  },
  school: {
    type: String,
    required: [true, 'School is required']
  },
  help_hub: {
    type: String,
    required: [true, 'Help hub is required']
  },
  current_game: {
    type: String,
    required: [true, 'Current game is required']
  },
  image: {
    type: String,
    default: null
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;