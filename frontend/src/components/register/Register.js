import React, { useState } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';
import './Register.css';
import axios from 'axios';


function Register() {
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });

  let [err,setErr]=useState('')
  let navigate=useNavigate()

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/user-api/user', formDetails);
      console.log(res);
      if (res.data.message === 'User created') {
        navigate('/Login');
      } else if (res.data.message === 'User existed') {
        alert('User already exists. Please login or use a different email.');
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErr('An error occurred while registering.');
    }
  };
  
  


  return (
    <div>
      <div className="register-container flex-center">
        <h2 className="form-heading">Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstname"
            className="form-input"
            placeholder="Enter your first name"
            value={formDetails.firstname}
            onChange={inputChange}
            required
          />
          <input
            type="text"
            name="lastname"
            className="form-input"
            placeholder="Enter your last name"
            value={formDetails.lastname}
            onChange={inputChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
            // pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address"
            required
        />


          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
            minLength="8"
            title="Password must be at least 8 characters"
            required
          />
          <input
            type="password"
            name="confpassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formDetails.confpassword}
            onChange={inputChange}
            minLength="8"
            title="Password must be at least 8 characters"
            required
          />

          <button type="submit" className="cbtn form-btn">
            Submit
          </button>
        </form>
        <p className='link mt-3 fs-5'>
          Already a user?{" "}
          <NavLink className="login-link" to={"/login"}>
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
