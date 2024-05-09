import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  Link } from 'react-router-dom';
import '../statutc/css/style.css'
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all projects from the server
    axios.get('http://localhost:8000/api/projects')
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  // Categorize projects by status
  const todoProjects = projects.filter(p => p.status === 'To Do');
  const inProgressProjects = projects.filter(p => p.status === 'In Progress');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  // Update project status to 'In Progress'
  const startProject = (id) => {
    axios.put(`http://localhost:8000/api/project/${id}`, { status: 'In Progress' })
      .then(res => {
        // Refresh projects after updating the status
        setProjects(prevProjects => prevProjects.map(p => {
          if (p._id === id) {
            p.status = 'In Progress';
          }
          return p;
        }));
      })
      .catch(err => {
        setError(err.message);
      });
  };

  // Update project status to 'Completed'
  const completeProject = (id) => {
    axios.put(`http://localhost:8000/api/project/${id}`, { status: 'Completed' })
      .then(res => {
        // Refresh projects after updating the status
        setProjects(prevProjects => prevProjects.map(p => {
          if (p._id === id) {
            p.status = 'Completed';
          }
          return p;
        }));
      })
      .catch(err => {
        setError(err.message);
      });
  };

  // Delete a project
  const removeProject = (id) => {
    axios.delete(`http://localhost:8000/api/project/${id}`)
      .then(res => {
        // Refresh projects after deleting the project
        setProjects(prevProjects => prevProjects.filter(p => p._id !== id));
      })
      .catch(err => {
        setError(err.message);
      });
  };
  const isPastDue = (dueDate) => {
    const now = new Date();
    return now > new Date(dueDate);
  };
  
  // Display a message if a project is past due
  const getDueDateMessage = (dueDate) => {
    if (isPastDue(dueDate)) {
      return 'Past Due';
    }
    return `Due on ${dueDate}`;
  };
  
  // Add a CSS class if a project is past due
  const getDueDateClassName = (dueDate) => {
    if (isPastDue(dueDate)) {
      return ' NOTE past-due';
    }
    return '';
  };
  return (
    <div>
  
      <h1>Project Manager</h1>
      <div style={{ display: 'flex' }}>
        <div className='todo' style={{ flex: 1 }}>
          <h2>To Do</h2>
          {todoProjects.map(p => (
            <div key={p._id}>
              <p>{p.name}</p>
              <p className={getDueDateClassName(p.dueDate)} style={{ color: 'red' }}>{getDueDateMessage(p.dueDate)}</p>
              <button onClick={() => startProject(p._id)}>Start Project</button>
              <button onClick={() => removeProject(p._id)}>Remove Project</button>
            </div>
          ))}
        </div>
        <div className='Progress' style={{ flex: 1 }}>
          <h2>In Progress</h2>
          {inProgressProjects.map(p => (
            <div key={p._id}>
              <p>{p.name}</p>
              <p className={getDueDateClassName(p.dueDate)}>{getDueDateMessage(p.dueDate)}</p>
              <button onClick={() => completeProject(p._id)}>Move to Completed</button>
              <button onClick={() => removeProject(p._id)}>Remove Project</button>
            </div>
          ))}
        </div>
        <div className='Completed' style={{ flex: 1 }}>
          <h2>Completed</h2>
          {completedProjects.map(p => (
            <div key={p._id}>
              <p>{p.name}</p>
              <p>{p.dueDate}</p>
              
              <button onClick={() => removeProject(p._id)}>Remove Project</button>
            </div>
          ))}
        </div>
      </div>
      <Link className='btn' to='/project/new'>Add New Project</Link>
    </div>
  );
};

export default Dashboard;
