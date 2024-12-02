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

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    const deletedStudent = await studentController.deleteStudent(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully', student: deletedStudent });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      message: 'Error deleting student',
      error: error.message,
    });
  }
});

// Route to create a student
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { username, school, hub, age, gender, email } = req.body;

    if (!username || !school || !hub || !age || !email) {
      return res.status(400).json({ message: 'Please provide all required fields: username, school, hub, age, and email.' });
    }

    const studentData = {
      username,
      school,
      hub,
      age,
      gender: gender || '',
      email,
      image: req.file ? req.file.path : null
    };

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

// Route to get distinct hubs
router.get('/hubs', async (req, res) => {
  try {
    const hubs = await studentController.getDistinctHubs();
    res.status(200).json(hubs);
  } catch (error) {
    console.error('Error fetching hubs:', error);
    res.status(500).json({
      message: 'Error fetching hubs',
      error: error.message,
    });
  }
});

// Route to get distinct schools
router.get('/schools', async (req, res) => {
  try {
    const schools = await studentController.getDistinctSchools();
    res.status(200).json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({
      message: 'Error fetching schools',
      error: error.message,
    });
  }
});

// Route to get distinct genders
router.get('/genders', async (req, res) => {
  try {
    const genders = await studentController.getDistinctGenders();
    res.status(200).json(genders);
  } catch (error) {
    console.error('Error fetching genders:', error);
    res.status(500).json({
      message: 'Error fetching genders',
      error: error.message,
    });
  }
});


// Update a student
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const { username, school, hub, age, gender, email } = req.body;

    const updateData = {
      username,
      school,
      hub,
      age,
      gender: gender || '',
      email,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedStudent = await studentController.updateStudent(studentId, updateData);
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      message: 'Error updating student',
      error: error.message
    });
  }
});

module.exports = router;
