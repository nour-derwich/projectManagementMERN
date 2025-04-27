
// routes/project.routes.js


const {
    getAllProjects,
    createProject,
    updateProjectStatus,
    deleteProject,
  } = require('../controllers/project.controller');
  
  module.exports = (app) => {
    app.get('/api/projects', getAllProjects);
    app.post('/api/projects', createProject);
    app.put('/api/project/:id', updateProjectStatus);
    app.delete('/api/project/:id', deleteProject);
  };
  