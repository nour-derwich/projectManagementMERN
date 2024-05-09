import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../statutc/css/style.css'
const AddProject = () => {
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    name: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };

    axios
      .post(`http://localhost:8000/api/projects`, projectData, config)
      .then((res) => {
       
        navigate('/dash');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='box'>
      <h1>Project Manager</h1>
      <Link className='btn' to="/dash">Back to Dashboard</Link>
   
        <legend>Plan a new project</legend>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name Project:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              required
              minLength="3"
              className='m-1'
            />
          </div>
          <div>
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={projectData.dueDate}
              onChange={handleChange}
              required
              className='m-1'
            />
          </div>
          <input type="submit" value="Plan Project"/>
        </form>
   
    </div>
  );
};

export default AddProject;
