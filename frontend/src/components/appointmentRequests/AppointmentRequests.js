// AppointmentRequests.js

import React, { useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaUserCheck, FaUserTimes } from 'react-icons/fa'; // Import React icons
import './AppointmentsRequests.css'; // Import the CSS file
import { useAppointments } from '../../AppointmentsContext'; // Import the AppointmentsContext

const AppointmentRequests = () => {
  const { appointments, isLoading, errorMessage, handleAttendance } = useAppointments();

  useEffect(() => {
    // You may remove the fetch call here if handled by context provider
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <FaCheckCircle color="green" />;
      case 'Attended':
        return <FaUserCheck color="blue" />;
      case 'Not Attended':
        return <FaUserTimes color="red" />;
      default:
        return null;
    }
  };

  return (
    <div className="appointment-requests-container">
      <h2 className="appointments-title fs-2 m-4">Accepted Appointments</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {appointments.length === 0 ? (
            <p className='fs-2 text-danger'>No accepted appointments.</p>
          ) : (
            <ul style={{ width: '100%', padding: '0' }}>
              {appointments.map(appointment => (    
                <li key={appointment._id} className="appointment-card">
                  <div className="details-container">
                    <div className="detail-column">
                      <div className="detail">Doctor: {appointment.doctorDetails[0]?.doctorname}</div>
                      <div className="detail">Specialization: {appointment.doctorDetails[0]?.specialization}</div>
                    </div>
                    <div className="detail-column">
                      <div className="detail"><FaCalendarAlt color="#191970" /> Date: {appointment.date}</div>
                      <div className="detail"><FaClock color="#FFFAFA" /> Time: {appointment.time}</div>
                    </div>
                    <div className="detail-column">
                      <div className="detail">User: {appointment.userDetails[0]?.firstname} {appointment.userDetails[0]?.lastname}</div>
                      <div className="detail">Email: {appointment.userDetails[0]?.email}</div>
                    </div>
                    <div className={`appointment-status ${appointment.status.toLowerCase()}`}>
                      {getStatusIcon(appointment.status)} Status: {appointment.status}
                    </div>
                    {appointment.status === 'Attended' || appointment.status === 'Not Attended' ? (
                      <div className="attendance-status">
                        {appointment.status === 'Attended' ? <span className="text-success">Attended</span> : <span className="text-danger">Not Attended</span>}
                      </div>
                    ) : (
                      <div className="attendance-buttons">
                        <button className="btn btn-success" onClick={() => handleAttendance(appointment._id, true)}>Mark as Attended</button>
                        <button className="btn btn-danger" onClick={() => handleAttendance(appointment._id, false)}>Mark as Not Attended</button>
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

export default AppointmentRequests;
