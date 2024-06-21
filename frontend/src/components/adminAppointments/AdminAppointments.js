// import React, { useState, useEffect } from 'react';
// import axiosWithToken from '../../axiosWithToken';
// import { FaCalendarAlt, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
// import './AdminAppointments.css';

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const response = await axiosWithToken.get('http://localhost:3000/admin-api/all-appointments');
//       setAppointments(response.data.appointments);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       setIsLoading(false);
//     }
//   };

//   const handleApprove = async (appointmentId) => {
//     try {
//       await axiosWithToken.post(`http://localhost:3000/admin-api/approve-appointment/${appointmentId}`);
//       setAppointments(updateStatus(appointmentId, 'Approved'));
//       alert('Appointment approved successfully!');
//     } catch (error) {
//       console.error('Error approving appointment:', error);
//       alert('Error approving appointment');
//     }
//   };

//   const handleReject = async (appointmentId) => {
//     try {
//       await axiosWithToken.post(`http://localhost:3000/admin-api/reject-appointment/${appointmentId}`);
//       setAppointments(updateStatus(appointmentId, 'Rejected'));
//       alert('Appointment rejected successfully!');
//     } catch (error) {
//       console.error('Error rejecting appointment:', error);
//       alert('Error rejecting appointment');
//     }
//   };

//   const handleAttendance = async (appointmentId, attended) => {
//     try {
//       await axiosWithToken.patch(`http://localhost:3000/admin-api/mark-attendance/${appointmentId}`, { attended });
//       setAppointments(updateAttendance(appointmentId, attended ? 'Attended' : 'Not Attended'));
//       alert(`Attendance status updated to ${attended ? 'attended' : 'not attended'}.`);
//     } catch (error) {
//       console.error('Error updating attendance:', error);
//       alert('Error updating attendance');
//     }
//   };

//   const updateStatus = (appointmentId, status) => {
//     return appointments.map(appointment =>
//       appointment._id === appointmentId ? { ...appointment, status } : appointment
//     );
//   };

//   const updateAttendance = (appointmentId, attended) => {
//     return appointments.map(appointment =>
//       appointment._id === appointmentId ? { ...appointment, attended } : appointment
//     );
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Approved':
//         return <FaCheckCircle color="green" />;
//       case 'Rejected':
//         return <FaTimesCircle color="red" />;
//       case 'Pending':
//         return <FaHourglassHalf />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="appointments-container">
//       <h2 className="appointments-title fs-2 m-4">All Appointments</h2>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           {appointments.length === 0 ? (
//             <p className='fs-2 text-danger'>No appointments found.</p>
//           ) : (
//             <ul style={{ width: '100%', padding: '0' }}>
//               {appointments.map(appointment => (
//                 <li key={appointment._id} className="appointment-card">
//                   <div className="details-container">
//                     <div className="detail-column">
//                       <div className="detail">User: {appointment.userDetails.length > 0 ? appointment.userDetails[0].name : 'Not Available'} ({appointment.userDetails.length > 0 ? appointment.userDetails[0].email : 'Not Available'})</div>
//                       <div className="detail">Contact Number: {appointment.userDetails.length > 0 ? appointment.userDetails[0].contactNumber : 'Not Available'}</div>
//                     </div>
//                     <div className="detail-column">
//                       <div className="detail">Doctor: {appointment.doctorDetails.length > 0 ? appointment.doctorDetails[0].doctorname : 'Not Available'}</div>
//                       <div className="detail">Specialization: {appointment.doctorDetails.length > 0 ? appointment.doctorDetails[0].specialization : 'Not Available'}</div>
//                     </div>
//                     <div className="detail-column">
//                       <div className="detail"><FaCalendarAlt color="#191970" /> Date: {appointment.date}</div>
//                       <div className="detail"><FaClock color="#FFFAFA" /> Time: {appointment.time}</div>
//                     </div>
//                     <div className={`appointment-status ${appointment.status?.toLowerCase()}`}>
//                       {getStatusIcon(appointment.status)} Status: {appointment.status}
//                     </div>
//                     <div className="attendance-status">
//                       {appointment.attended !== undefined && (
//                         <p>Attendance: {appointment.attended}</p>
//                       )}
//                     </div>
//                     <div className="action-buttons">
//                       {appointment.status === 'Pending' && (
//                         <>
//                           <button onClick={() => handleApprove(appointment._id)} className="approve-button">Approve</button>
//                           <button onClick={() => handleReject(appointment._id)} className="reject-button">Reject</button>
//                         </>
//                       )}
//                       {appointment.status === 'Approved' && appointment.attended === undefined && (
//                         <>
//                           <button onClick={() => handleAttendance(appointment._id, true)} className="attendance-button">Mark as Attended</button>
//                           <button onClick={() => handleAttendance(appointment._id, false)} className="attendance-button">Mark as Not Attended</button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminAppointments;

import React, { useEffect, useState } from 'react';
import axiosWithToken from '../../axiosWithToken'; // Import axiosWithToken
import { FaCalendarAlt, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa'; // Import React icons
import './AdminAppointments.css'; // Import the CSS file

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const response = await axiosWithToken.get('http://localhost:3000/admin-api/pending-appointments');
      setAppointments(response.data.appointments);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching pending appointments:', error);
      setErrorMessage('Error fetching pending appointments');
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosWithToken.post(`http://localhost:3000/admin-api/approve-appointment/${id}`);
      const updatedAppointments = appointments.map(appointment =>
        appointment._id === id ? { ...appointment, status: 'Approved' } : appointment
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error approving appointment:', error);
      setErrorMessage('Error approving appointment');
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosWithToken.post(`http://localhost:3000/admin-api/reject-appointment/${id}`);
      setAppointments(appointments.filter(appointment => appointment._id !== id));
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      setErrorMessage('Error rejecting appointment');
    }
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
    <div className="admin-appointments-container">
      <h2 className="appointments-title fs-2 m-4">Pending Appointments</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {appointments.length === 0 ? (
            <p className='fs-2 text-danger'>No pending appointments.</p>
          ) : (
            <ul style={{ width: '100%', padding: '0' }}> {/* Ensure ul takes full width */}
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
                    <div className="actions">
                      {appointment.status === 'Pending' && (
                        <>
                          <button className="approve-btn" onClick={() => handleApprove(appointment._id)}>Approve</button>
                          <button className="reject-btn" onClick={() => handleReject(appointment._id)}>Reject</button>
                        </>
                      )}
                     
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

export default AdminAppointments;



