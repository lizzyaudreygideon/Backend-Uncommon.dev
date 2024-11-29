const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  school: { type: String, required: true },
  hub: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: false },
  image: { type: String, default: null },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true, // Removes any leading/trailing spaces
    lowercase: true, // Converts to lowercase to avoid case-sensitive conflicts
  },
  dateJoined: { type: Date, default: Date.now },
});

// Create a unique index for email in the collection
studentSchema.index({ email: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
