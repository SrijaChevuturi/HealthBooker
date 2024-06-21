import React, { useState, useEffect } from 'react';
import axiosWithToken from '../../axiosWithToken'; // Import axiosWithToken
import { FaCalendarAlt, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa'; // Import React icons
import './Appointments.css'; // Import the CSS file

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user appointments when the component mounts
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Fetch user appointments from the backend using axiosWithToken
      const response = await axiosWithToken.get('http://localhost:3000/user-api/appointments');
      // Update state with fetched appointments
      setAppointments(response.data.appointments);
      setIsLoading(false);
    } catch (error) { 
      console.error('Error fetching appointments:', error);
      setIsLoading(false);
    }
  };

  const getStatus = (appointment) => {
    return appointment.status || 'Unknown';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <FaCheckCircle color="green" />;
      case 'Rejected':
        return <FaTimesCircle color="red" />;
      case 'Pending':
        return <FaHourglassHalf />;
      default:
        return null;
    }
  };

  return (
    <div className="appointments-container">
      <h2 className="appointments-title fs-2 m-4">Your Appointments</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {appointments.length === 0 ? (
            <p className='fs-2 text-danger'>No appointments booked.</p>
          ) : (
            <ul style={{ width: '100%', padding: '0' }}> {/* Ensure ul takes full width */}
              {appointments.map(appointment => (
                <li key={appointment._id} className="appointment-card">
                  <div className="details-container">
                    <div className="detail-column">
                      <div className="detail">Doctor: {appointment.doctorDetails?.doctorname}</div>
                      <div className="detail">Specialization: {appointment.doctorDetails?.specialization}</div>
                    </div>
                    <div className="detail-column">
                      <div className="detail"><FaCalendarAlt color="#191970" /> Date: {appointment.date}</div>
                      <div className="detail"><FaClock color="#FFFAFA" /> Time: {appointment.time}</div>
                    </div>
                    <div className={`appointment-status ${getStatus(appointment).toLowerCase()}`}>
                      {getStatusIcon(getStatus(appointment))} Status: {getStatus(appointment)}
                    </div>
                    {appointment.attended && (
                      <div className="attendance-status">
                        <p>Attendance: {appointment.attended}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Appointments;
