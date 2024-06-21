import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminNavbar() {
  return (
    <div className='header'>
      <nav>
        <div className="nav-items-container">
          <ul className='nav-links'>
          <li className='nav-item'>
              <NavLink className="nav-link fs-5" to="Admin">
                Admin Dashboard
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className="nav-link fs-5" to="AdminAppointments">
                Appointments
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className="nav-link fs-5" to="AllDoctors">
                Doctors
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className="nav-link fs-5" to="Users">
                Users
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className="nav-link fs-5" to="Quries">
                View Queries
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default AdminNavbar;
