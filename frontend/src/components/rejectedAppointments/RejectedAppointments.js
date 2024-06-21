import React, { useEffect, useState } from 'react';
import axiosWithToken from '../../axiosWithToken'; // Import axiosWithToken
import './RejectedAppointments.css'; // Import the CSS file

const RejectedAppointments = () => {
  const [rejectedAppointments, setRejectedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchRejectedAppointments();
  }, []);

  const fetchRejectedAppointments = async () => {
    try {
      const response = await axiosWithToken.get('http://localhost:3000/admin-api/rejected-appointments');
      setRejectedAppointments(response.data.appointments);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching rejected appointments:', error);
      setErrorMessage('Error fetching rejected appointments');
      setIsLoading(false);
    }
  };

  return (
    <div className="rejected-appointments-container">
      <h2 className="appointments-title fs-2 m-4">Rejected Appointments</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {rejectedAppointments.length === 0 ? (
            <p className='fs-2 text-danger'>No rejected appointments.</p>
          ) : (
            <ul style={{ width: '100%', padding: '0' }}> {/* Ensure ul takes full width */}
              {rejectedAppointments.map(appointment => (
                <li key={appointment._id} className="appointment-card">
                  <div className="details-container">
                    <div className="detail-column">
                      <div className="detail">Doctor: {appointment.doctorDetails[0]?.doctorname}</div>
                      <div className="detail">Specialization: {appointment.doctorDetails[0]?.specialization}</div>
                    </div>
                    <div className="detail-column">
                      <div className="detail">Date: {appointment.date}</div>
                      <div className="detail">Time: {appointment.time}</div>
                    </div>
                    <div className="detail-column">
                      <div className="detail">User: {appointment.userDetails[0]?.firstname} {appointment.userDetails[0]?.lastname}</div>
                      <div className="detail">Email: {appointment.userDetails[0]?.email}</div>
                    </div>
                    <div className="appointment-status rejected">
                      Status: Rejected
                    </div>
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

export default RejectedAppointments;
