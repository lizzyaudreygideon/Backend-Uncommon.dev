const express = require('express');
const router = express.Router();
const studentService = require('../controllers/studentController');
const multer = require('multer');
const path = require('path');

// CORS Middleware 
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  next();
});

//Configure multer for in-memory storage
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// PUT: update student with optional image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;
    
    if (req.file) {
      updateData.image = req.file.path;
    }
    
    const updatedStudent = await studentService.updateStudent(studentId, updateData);
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating student', 
      error: error.message 
    });
  }
});

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// POST filter students
router.post('/filter', async (req, res) => {
  try {
    const filters = req.body;
    const students = await studentService.filterStudents(filters);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering students', error: error.message });
  }
});

// POST new student
router.post('/', async (req, res) => {
  try {
    const studentData = req.body;
    
    // Basic validation
    if (!studentData.name || !studentData.help_hub || !studentData.school) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    const newStudent = await studentService.createStudent(studentData);
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', details: error.message });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Student with this email or username already exists' });
    }
    
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});




// GET student by ID
router.get('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await studentService.getStudentById(studentId);
    res.status(200).json(student);
  } catch (error) {
    res.status(404).json({ message: 'Student not found', error: error.message });
  }
});

// PUT: update student
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;
    const updatedStudent = await studentService.updateStudent(studentId, updateData);
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// DELETE: delete student
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    await studentService.deleteStudent(studentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

// POST new student with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const studentData = req.body;
    
    // Handle image upload
    if (req.file) {
      const { fileName, fileUrl } = await uploadToMalta(req.file);
      studentData.image_url = fileUrl;
      studentData.image_filename = fileName;
    }
    
    const newStudent = await studentService.createStudent(studentData);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating student', 
      error: error.message 
    });
  }
});

// PUT: update student with image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;
    
    // Handle image upload and delete old image
    if (req.file) {
      const student = await studentService.getStudentById(studentId);
      
      if (student.image_filename) {
        await deleteFromMalta(student.image_filename);
      }
      
      const { fileName, fileUrl } = await uploadToMalta(req.file);
      updateData.image_url = fileUrl;
      updateData.image_filename = fileName;
    }
    
    const updatedStudent = await studentService.updateStudent(studentId, updateData);
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating student', 
      error: error.message 
    });
  }
});

// DELETE: handle image deletion
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await studentService.getStudentById(studentId);
    
    if (student.image_filename) {
      await deleteFromMalta(student.image_filename);
    }
    
    await studentService.deleteStudent(studentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting student', 
      error: error.message 
    });
  }
});

module.exports = router;