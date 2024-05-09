const {Project} = require('../models/project.model');

// GET all projects sorted by due date
module.exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ dueDate: 1 });
    res.json(projects.map(project => {
      return {
        ...project._doc,
        pastDue: project.dueDate < Date.now()
      };
    }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new project

module.exports.createProject = async (req, res) => {
  const project = new Project({
    name: req.body.name,
    dueDate: req.body.dueDate
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// PUT update a project's status

module.exports.updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project == null) {
      return res.status(404).json({ message: 'Project not found' });
    }
    project.status = req.body.status;
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a project


module.exports.deleteProject = (req, res) => {
  Project.deleteOne({ _id: req.params.id })
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json({ err }));
};
