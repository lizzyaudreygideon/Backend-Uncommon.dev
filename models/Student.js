const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Student name is required'] 
  },
  username: {
    type: String,
    required: [true, ],
    unique: true
  },
  email: {
    type: String,
    required: [true, ],
    unique: true
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
    required: [true, ]
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Pending'],
    default: 'Active'
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

// Method to check student status
studentSchema.methods.isActive = function() {
  return this.status === 'Active';
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;