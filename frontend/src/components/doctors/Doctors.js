import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Doctors.css';
import { useNavigate } from 'react-router-dom';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('http://localhost:3000/doctor-api/doctors')
      .then(response => {
        setDoctors(response.data.doctors);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  const handleBooking = (doctor) => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
      // If logged in, proceed to booking
      navigate('/BookAppointment', { state: { doctor } });
    } else {
      // If not logged in, show login prompt
      alert('Please log in to book an appointment.');
      // Redirect to login page
      navigate('/Login');
    }
  };
  
  return (
    <div>
      <div className="doctors-container">
        {doctors.map(doctor => (
          <div key={doctor._id} className="doctor-card">
            <h2>Dr {doctor.doctorname}</h2>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Experience:</strong> {doctor.experience}yrs</p>
            <p><strong>Fees:</strong>${doctor.fees}</p>
            <p><strong>Contact:</strong> {doctor.phone}</p>
            <button onClick={() => handleBooking(doctor)}>BOOK APPOINTMENT</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Doctors;
