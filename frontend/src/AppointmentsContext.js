// AppointmentsContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosWithToken from './axiosWithToken';

const AppointmentsContext = createContext();

export const useAppointments = () => useContext(AppointmentsContext);

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchAcceptedAppointments();
  }, []);

  const fetchAcceptedAppointments = async () => {
    try {
      const response = await axiosWithToken.get('http://localhost:3000/admin-api/accepted-appointments');
      console.log('Response:', response); // Log the response
      setAppointments(response.data.appointments);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching accepted appointments:', error);
      setErrorMessage('Error fetching accepted appointments');
      setIsLoading(false);
    }
  };
  

  const handleAttendance = async (appointmentId, attended) => {
    try {
      const response = await axiosWithToken.patch(`http://localhost:3000/admin-api/mark-attendance/${appointmentId}`, { attended });
      if (response.status === 200) {
        // Update local state to reflect the attendance status
        setAppointments(prevAppointments => {
          return prevAppointments.map(appointment => {
            if (appointment._id === appointmentId) {
              return { ...appointment, status: attended ? 'Attended' : 'Not Attended' };
            }
            return appointment;
          });
        });
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setErrorMessage('Error updating attendance');
    }
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, isLoading, errorMessage, handleAttendance }}>
      {children}
    </AppointmentsContext.Provider>
  );
};
