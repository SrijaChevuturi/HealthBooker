import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosWithToken from '../../axiosWithToken';
import './BookAppointment.css';

function BookAppointment() {
  const location = useLocation();
  const doctor = location.state?.doctor;
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [time, setTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    setUserId(userIdFromStorage); // Set userId retrieved from local storage
  }, []);

  useEffect(() => {
    if (date && doctor) {
      const fetchAvailableTimes = async () => {
        try {
          const response = await axiosWithToken.get(
            `http://localhost:3000/doctor-api/available-times/${doctor._id}/${date}`
          );
          const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const currentDate = new Date().toISOString().split('T')[0];
          const filteredTimes = response.data.availableTimes.filter(timeSlot => {
            if (date === currentDate) {
              // For today's date, filter out past time slots
              return timeSlot > currentTime;
            } else {
              // For future dates, keep all time slots
              return true;
            }
          });
          setAvailableTimes(filteredTimes);
        } catch (error) {
          console.error('Error fetching available times:', error);
          setErrorMessage('Error fetching available times');
        }
      };

      fetchAvailableTimes();
    }
  }, [date, doctor]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const appointmentDetails = { doctorId: doctor._id, date, time, userId };

    try {
      const response = await axiosWithToken.post('http://localhost:3000/admin-api/requestAppointment', appointmentDetails);

      if (response.status === 201) {
        setSuccessMessage('Appointment request sent successfully');
        setDate('');
        setTime('');
        setAvailableTimes([]);
        window.alert('Appointment request sent successfully!');
        // Navigate to the Appointments page after successful booking
        navigate('/Appointments');
      } else {
        setErrorMessage('Failed to send appointment request');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(`Error: ${error.response.data.error}`);
      } else {
        setErrorMessage('Error sending appointment request');
      }
    }
  };

  return (
    <div className="book-appointment-container">
      <h2>Book Appointment with Dr {doctor?.doctorname}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        {availableTimes.length > 0 && (
          <div>
            <label>Time:</label>
            <select value={time} onChange={e => setTime(e.target.value)} required>
              <option value="" disabled>
                Select a time
              </option>
              {availableTimes.map((timeSlot, index) => (
                <option key={index} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit">Request Appointment</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default BookAppointment;
