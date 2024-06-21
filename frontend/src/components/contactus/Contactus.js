import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contactus.css';

function Contactus() {
  const [formDetails, setFormDetails] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

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
      const response = await fetch('http://localhost:3000/user-api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDetails),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message);
        // Show success message as a pop-up
        alert('Message sent successfully!');
        // Reset form details and navigate to home page
        setFormDetails({ name: '', email: '', message: '' });
        navigate('/');
      } else {
        setResponseMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponseMessage('An error occurred while submitting the form');
    }
  };

  return (
    <div className='contact-container flex-center contact'>
      <h2 className='form-heading'>Contact Us</h2>
      <form className='contact-form text-secondary' onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          className='form-input'
          placeholder='Enter your name'
          value={formDetails.name}
          onChange={inputChange}
        />
        <input
          type='email'
          name='email'
          className='form-input'
          placeholder='Enter your email'
          value={formDetails.email}
          onChange={inputChange}
        />
        <textarea
          type='text'
          name='message'
          className='form-input'
          placeholder='Enter your message'
          value={formDetails.message}
          onChange={inputChange}
          rows='8'
          cols='12'
        ></textarea>

        <button type='submit' className='cbtn form-btn'>
          Send
        </button>
      </form>
      {responseMessage && <p className='response-message'>{responseMessage}</p>}
    </div>
  );
}

export default Contactus;
