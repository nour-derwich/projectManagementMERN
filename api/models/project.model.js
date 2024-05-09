const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required:  [true, 'name unique'],
    minlength: 3,
    unique: true 
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do'
  }
});

module.exports.Project= mongoose.model('Project', projectSchema);

