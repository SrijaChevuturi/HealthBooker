import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../AuthContext';
import axiosWithToken from '../../axiosWithToken'; // Import axiosWithToken

function Login() {
  const [formDetails, setFormDetails] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  let navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formDetails;
  
    // Clear previous errors and localStorage values for clarity
    setError('');
    localStorage.removeItem('admin');
    localStorage.removeItem('userId');

    try {
      if (email === 'admin@gmail.com' && password === 'healthbooker') {
        // Admin credentials match
        const response = await axiosWithToken.post('http://localhost:3000/admin-api/admin-login', formDetails);
        const { token } = response.data;
        login(token, true); // Pass true to indicate admin login
        localStorage.setItem('admin', 'true'); // Store admin status
        navigate('/Admin');
      } else {
        // User login
        const response = await axiosWithToken.post('http://localhost:3000/user-api/login', formDetails);
        if (response.data.message === 'Login Success') {
          const { token, userId } = response.data; // Extract token and userId from response
          login(token, false); // Pass false to indicate user login
          localStorage.setItem('userId', userId); // Store userId in local storage
          navigate('/Home');
        } else {
          setError('Invalid email or password.');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="register-container flex-center">
      <h2 className="form-heading">Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="form-input"
          placeholder="Enter your email"
          value={formDetails.email}
          onChange={inputChange}
          required
        />
        <input
          type="password"
          name="password"
          className="form-input"
          placeholder="Enter your password"
          value={formDetails.password}
          onChange={inputChange}
          required
        />
        <button type="submit" className="lbtn form-btn">
          Submit
        </button>
      </form>
      <p className="link mt-3 fs-5">
        New user?{' '}
        <NavLink className="login-link" to={'/register'}>
          Register
        </NavLink>
      </p>
    </div>
  );
}

export default Login;
