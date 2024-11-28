const Student = require('../models/Student');
const fs = require('fs');

const getAllStudents = async () => {
  try {
    const students = await Student.find({});
    return students;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
};

const createStudent = async (studentData) => {
  try {
    const newStudent = new Student(studentData);
    await newStudent.save();
    return newStudent;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

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
    throw error;
  }
};

const getStudentById = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};


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
      throw error;
    }
  };

const filterStudents = async (filters) => {
  try {
    const { 
      searchTerm, 
      selectedHub, 
      selectedStatus, 
      selectedGame 
    } = filters;

    const query = {};

    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: 'i' };
    }

    if (selectedHub && selectedHub !== 'All') {
      query.help_hub = selectedHub;
    }

    if (selectedStatus && selectedStatus !== 'All') {
      query.status = selectedStatus;
    }

    if (selectedGame && selectedGame !== 'All') {
      query.current_game = selectedGame;
    }

    const students = await Student.find(query);
    return students;
  } catch (error) {
    console.error('Error filtering students:', error);
    throw error;
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  getStudentById,
  deleteStudent,
  filterStudents
};