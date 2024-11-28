

// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Fullname: {
    type: String,
    required: [true, 'Student name is required']
  },
  school: {
    type: String,
    required: [true, 'School is required']
  },
  hub: {
    type: String,
    required: [true, 'Hub is required']
  },
   age: {
    type: String,
    required: [true, 'Age hub is required']
  },
  gender: {
    type: String,
    required: [true, 'Game is required']
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