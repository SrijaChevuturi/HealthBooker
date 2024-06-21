import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Contactus from './components/contactus/Contactus';
import Aboutus from './components/aboutus/Aboutus';
import RootLayout from './components/RootLayout';
import Profile from './components/profile/Profile';
import Doctors from './components/doctors/Doctors';
import BookAppointment from './components/book-appointment/BookAppointment';
import { AuthProvider } from './AuthContext';
import './App.css'
import Appointments from './components/appointments/Appointments';
import Admin from './components/admin/Admin';
import AdminNavbar from './components/adminNavbar/AdminNavbar';
import AllDoctors from './components/allDoctors/AllDoctors';
import Users from './components/users/Users';
import Quries from './components/quries/Quries';
import AdminAppointments from './components/adminAppointments/AdminAppointments';
import AppointmentRequests from './components/appointmentRequests/AppointmentRequests';
import RejectedAppointments from './components/rejectedAppointments/RejectedAppointments';
import { AppointmentsProvider } from './AppointmentsContext';


function App() {
  let router = createBrowserRouter([
    {
      path: '',
      element: <RootLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'Home',
          element: <Home />,
        },
        {
          path: 'Register',
          element: <Register />,
        },
        {
          path: 'Login',
          element: <Login />,
        },
        {
          path:'Aboutus',
          element:<Aboutus/>,
        },
        {
          path: 'Contactus',
          element: <Contactus />,
        },
        {
          path: 'Profile',
          element: <Profile />,
        },
        {
          path: 'Doctors',
          element: <Doctors />,
        },
        {
          path: 'BookAppointment',
          element: <BookAppointment />,
        },
        {
          path: 'Appointments',
          element: <Appointments />,
        },
        {
          path: 'Admin',
          element: <Admin />,
        },
        {
          path: 'AdminNavbar',
          element: <AdminNavbar />,
        },
        {
          path: 'AllDoctors',
          element: <AllDoctors />,
        },
        {
          path: 'Users',
          element: <Users />,
        },
        {
          path: 'Quries',
          element: <Quries />,
        },
        {
          path: 'AdminAppointments',
          element: <AdminAppointments />,
        },
        {
          path: 'AppointmentRequests',
          element: <AppointmentRequests />,
        },
        {
          path: 'RejectedAppointments',
          element: <RejectedAppointments />,
        }
      ],
    },
  ]);

  return (
    <div className="App">
      <AuthProvider>
        <AppointmentsProvider>
        <RouterProvider router={router} />
        </AppointmentsProvider>
      </AuthProvider>
    </div>
  );  
}

export default App;
