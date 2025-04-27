// models/activity.model.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: false  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  action: { type: String, enum: ['create', 'update', 'delete', 'move'] },
  details: String,
  timestamp: { type: Date, default: Date.now },
   lastEditedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' ,
    required: false 
  }
});

module.exports = mongoose.model('Activity', activitySchema);