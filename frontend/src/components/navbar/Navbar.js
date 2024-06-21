import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='header'>
      <nav>
        <h2 className="nav-logo">
          Healthbooker
        </h2>
        <div className={`nav-items-container ${isLoggedIn ? 'logged-in' : ''}`}>
          {isLoggedIn && user && !isAdmin && (
            <div className='user-info'>
              <p className='user-name mt-3 fs-4'>Welcome <span>{`${user.firstname} ${user.lastname}`}</span></p>
            </div>
          )}
          <ul className='nav-links'>
            {!isAdmin && (
              <li className='nav-item'>
                <NavLink className="nav-link fs-5" to="/Home">
                  Home
                </NavLink>
              </li>
            )}

            {isAdmin ? (
              <ul className='nav-links'>
                <li className='nav-item'>
                  <NavLink className="nav-link fs-5" to="Admin">
                    Admin Dashboard
                  </NavLink>
                </li>
                <li className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`} onClick={toggleDropdown}>
                  <span className="nav-link dropdown-toggle fs-5">
                    Appointments
                  </span>
                  <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                    <li>
                      <NavLink className="dropdown-item" to="AdminAppointments">
                        Pending Appointments
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="AppointmentRequests">
                        Accepted Appointments
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="RejectedAppointments">
                        Rejected Appointments
                      </NavLink>
                    </li>
                  </ul>
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
            ) : (
              <li className='nav-item'>
                <NavLink className="nav-link fs-5" to="/Doctors">
                  Doctors
                </NavLink>
              </li>
            )}

            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <>
                    <li className='nav-item'>
                      <NavLink className="nav-link fs-5" to="/Appointments">
                        Appointments
                      </NavLink>
                    </li>

                    <li className='nav-item'>
                      <NavLink className="nav-link fs-5" to="/Profile">
                        Profile
                      </NavLink>
                    </li>

                    <li className='nav-item'>
                      <NavLink className="nav-link fs-5" to="/Contactus">
                        Contact Us
                      </NavLink>
                    </li>
                  </>
                )}

                <li className='nav-item'>
                  <button className="nav-link fs-5" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <NavLink className="btn fs-5" to="/Register">
                    Register
                  </NavLink>
                </li>

                <li className='nav-item'>
                  <NavLink className="btn fs-5" to="/Login">
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
