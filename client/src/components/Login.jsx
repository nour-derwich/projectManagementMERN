import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';

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
      .post('http://localhost:5000/api/login', userData, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        navigate('/dash');
      })
      .catch((err) => {
        setEmailNotFoundErr(err.response?.data?.msg || 'Login failed');
        const errResponse = err.response?.data?.errors || {};
        console.log(errResponse);
        const errObj = {};
        for (const key of Object.keys(errResponse)) {
          errObj[key] = errResponse[key].message;
        }
        setErrors(errObj);
      });
  };

  return (
    <div className="login-form">
      <div className="text-center mb-4">
        <h4 className="mb-3 font-weight-bold">Sign in with:</h4>

        <div className="d-flex justify-content-between mx-auto" style={{ width: '60%' }}>
          <MDBBtn floating color="primary" className="mx-1">
            <MDBIcon fab icon="facebook-f" />
          </MDBBtn>

          <MDBBtn floating color="info" className="mx-1">
            <MDBIcon fab icon="twitter" />
          </MDBBtn>

          <MDBBtn floating color="danger" className="mx-1">
            <MDBIcon fab icon="google" />
          </MDBBtn>

          <MDBBtn floating color="dark" className="mx-1">
            <MDBIcon fab icon="github" />
          </MDBBtn>
        </div>

        <p className="text-center my-4 font-weight-bold">or:</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <MDBInput
            label="Email"
            id="email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="mb-1"
          />
          {errors.email && <p className="text-danger small">{errors.email}</p>}
          {emailNotFoundErr && <p className="text-danger small">{emailNotFoundErr}</p>}
        </div>
        
        <div className="mb-4">
          <MDBInput
            label="Password"
            id="password"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            className="mb-1"
          />
          {errors.password && <p className="text-danger small">{errors.password}</p>}
        </div>

        <div className="d-flex justify-content-between mb-4">
          <MDBCheckbox
            name="flexCheck"
            label="Remember me"
            id="flexCheckDefault"
          />
          <a href="#!">Forgot password?</a>
        </div>

        <MDBBtn type="submit" className="mb-4 w-100" color="primary">
          Sign in
        </MDBBtn>

        <div className="text-center">
          <p>
            Not a member? <Link to="#" onClick={() => document.querySelector('[data-tab="register"]')?.click()}>Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;