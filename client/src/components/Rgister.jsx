import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
   
    MDBBtn,
    MDBIcon,
  
  }
  from 'mdb-react-ui-kit';
const Register = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [dublicatedEmailErr, SetdublicatedEmailErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/users', userData, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        navigate('/dash');
      })
      .catch((err) => {
        // console.log('*********************', err.response.data);
        SetdublicatedEmailErr(err.response.data.msg);
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
            <p>Sign un with:</p>

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
            First Name
          </label>
          <input
            className="form-control"
            type="text"
            name="firstName"
            onChange={handleChange}
          />
          <p>{errors.firstName}</p>
        </div>
        <div>
          <label className="form-label" htmlFor="">
            Last Name
          </label>
          <input
            className="form-control"
            type="text"
            name="lastName"
            onChange={handleChange}
          />
          <p>{errors.lastName}</p>
        </div>
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
          <p>{dublicatedEmailErr && dublicatedEmailErr}</p>
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
        <div>
          <label className="form-label" htmlFor="">
            Confirm Password
          </label>
          <input
            className="form-control"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
          />
          <p>{errors.confirmPassword}</p>
        </div>
        <input type="submit" value="Register"  className="mb-4 w-100" />

          </form>
    </div>
  );
};

export default Register;
