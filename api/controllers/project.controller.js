const { Project } = require('../models/project.model');
const Activity = require('../models/activity.model');
const { sendEmail } = require('../utils/email');
const { projectCreatedTemplate } = require('../utils/emailTemplates');
const User = require('../models/user.models');
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
    dueDate: req.body.dueDate,
    lastEditedBy: req.user ? req.user.id : null
  });

  try {
    const newProject = await project.save();
    
    // Create activity record
    const activity = new Activity({
      userId: req.user ? req.user.id : null,
      projectId: newProject._id,
      action: 'create',
      details: `Project "${newProject.name}" was created`
    });
    await activity.save();
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('project_created', newProject);
    
    // Send email notifications to all users or specific roles
    try {
      // Get all users who should receive notifications (you can filter by role if needed)
      const users = await User.find({ role: { $in: ['admin', 'manager'] } });
      const template = projectCreatedTemplate(newProject);
      for (const user of users) {
        await sendEmail(user.email, template.subject, template.text, template.html);

      }
      
      console.log('Project creation notification emails sent');
    } catch (emailErr) {
      console.error('Failed to send notification emails:', emailErr);
      // Continue with the response even if emails fail
    }
    
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update a project's status
// In your updateProjectStatus controller
module.exports.updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const previousStatus = project.status;
    project.status = req.body.status;
    const updatedProject = await project.save();
    
    // Create activity record
    const activity = new Activity({
      projectId: project._id,
      action: 'move',
      details: `Status changed from ${previousStatus} to ${req.body.status}`
    });
    await activity.save();
    
    // Emit socket events
    const io = req.app.get('io');
    io.emit('activity_added', activity.toObject());
    io.emit('project_updated', updatedProject);
    
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// DELETE a project
module.exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('project_deleted', req.params.id);
    
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};