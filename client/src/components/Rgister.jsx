import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBBtn,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';

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
  const [duplicatedEmailErr, setDuplicatedEmailErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/users', userData, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        navigate('/dash');
      })
      .catch((err) => {
        setDuplicatedEmailErr(err.response?.data?.msg || 'Registration failed');
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
    <div className="register-form">
      <div className="text-center mb-4">
        <h4 className="mb-3 font-weight-bold">Sign up with:</h4>

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
        <div className="row mb-4">
          <div className="col">
            <MDBInput
              label="First Name"
              id="firstName"
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              required
              className="mb-1"
            />
            {errors.firstName && <p className="text-danger small">{errors.firstName}</p>}
          </div>
          <div className="col">
            <MDBInput
              label="Last Name"
              id="lastName"
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              required
              className="mb-1"
            />
            {errors.lastName && <p className="text-danger small">{errors.lastName}</p>}
          </div>
        </div>

        <div className="mb-4">
          <MDBInput
            label="Email"
            id="registerEmail"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="mb-1"
          />
          {errors.email && <p className="text-danger small">{errors.email}</p>}
          {duplicatedEmailErr && <p className="text-danger small">{duplicatedEmailErr}</p>}
        </div>

        <div className="mb-4">
          <MDBInput
            label="Password"
            id="registerPassword"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            className="mb-1"
          />
          {errors.password && <p className="text-danger small">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <MDBInput
            label="Confirm Password"
            id="registerConfirmPassword"
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
            className="mb-1"
          />
          {errors.confirmPassword && <p className="text-danger small">{errors.confirmPassword}</p>}
        </div>

        <MDBBtn type="submit" className="mb-4 w-100" color="primary">
          Sign up
        </MDBBtn>

        <div className="text-center">
          <p>
            Already a member? <Link to="#" onClick={() => document.querySelector('[data-tab="login"]')?.click()}>Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;