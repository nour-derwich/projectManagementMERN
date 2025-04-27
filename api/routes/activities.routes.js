module.exports = (app) => {
  const activitiesController = require('../controllers/activities.controller');
  app.get('/api/activities', activitiesController.getRecentActivities);
};