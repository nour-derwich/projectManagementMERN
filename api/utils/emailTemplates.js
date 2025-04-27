// utils/emailTemplates.js
const projectCreatedTemplate = (project) => {
  return {
    subject: `New Project Created: ${project.name}`,
    text: `A new project "${project.name}" has been created with a due date of ${project.dueDate.toLocaleDateString()}.`,
    html: `<h1>New Project Created</h1>
           <p>Project: <strong>${project.name}</strong></p>
           <p>Due Date: <strong>${project.dueDate.toLocaleDateString()}</strong></p>
           <p>Status: <strong>${project.status}</strong></p>
           <p>Login to the project management system to see more details.</p>`
  };
};

module.exports = {
  projectCreatedTemplate
};