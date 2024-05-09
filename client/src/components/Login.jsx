import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
   
    MDBBtn,
    MDBIcon,
  
  }
  from 'mdb-react-ui-kit';
const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({});
  const [emailNotFoundErr, setEmailNotFoundErr] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/login', userData, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        navigate('/dash');
      })
      .catch((err) => {
        // console.log('*********************', err.response.data);
        setEmailNotFoundErr(err.response.data.msg);
        const errResponse = err.response.data.errors;
        console.log(errResponse);
        const errObj = {};
        for (const key of Object.keys(errResponse)) {
          errObj[key] = errResponse[key].message;
        }
        setErrors(errObj);
      });
  };

  return (
    <div>
      <div className="text-center mb-3">
            <p>Sign in with:</p>

            <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='facebook-f' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='twitter' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='google' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='github' size="sm"/>
              </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div>

          <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="">
            Email
          </label>
          <input
            className="form-control"
            type="text"
            name="email"
            onChange={handleChange}
          />
          <p>{errors.email}</p>
          <p>{emailNotFoundErr && emailNotFoundErr}</p>
        </div>
        <div>
          <label className="form-label" htmlFor="">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            name="password"
            onChange={handleChange}
          />
          <p>{errors.password}</p>
        </div>
        <input type="submit" value="Login"  className="mb-4 w-100 btn btn-primary" />
      </form>

         
          <p className="text-center">Not a member? <a href="#!">Register</a></p>
      
    </div>
  );
};

export default Login;
