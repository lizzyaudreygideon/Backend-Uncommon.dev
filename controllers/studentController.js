// controllers/studentController.js
const Student = require('../models/Student');
const fs = require('fs');

// Get all students
const getAllStudents = async () => {
  try {
    const students = await Student.find({});
    return students;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw new Error('Error fetching students: ' + error.message);
  }
};

// Create a single student
const createStudent = async (studentData) => {
  try {
    const newStudent = new Student(studentData);
    await newStudent.save();
    return newStudent;
  } catch (error) {
    console.error('Error creating student:', error);
    throw new Error('Error creating student: ' + error.message);
  }
};

// Update a student
const updateStudent = async (studentId, updateData) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      throw new Error('Student not found');
    }
    return updatedStudent;
  } catch (error) {
    console.error('Error updating student:', error);
    throw new Error('Error updating student: ' + error.message);
  }
};

// Delete a student
const deleteStudent = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    // Delete image file if exists
    if (student.image) {
      fs.unlink(student.image, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    return await Student.findByIdAndDelete(studentId);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw new Error('Error deleting student: ' + error.message);
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
};
