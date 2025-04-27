// activities.controller.js
const Activity = require('../models/activity.model');

module.exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('projectId', 'name')
      .exec();
    
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

