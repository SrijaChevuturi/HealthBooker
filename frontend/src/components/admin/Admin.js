import React from 'react';
import './Admin.css';
import { Link } from 'react-router-dom';

function Admin() {
  return (
    <div className="admin-dashboard">
      <h1 className="mt-5">Admin Dashboard</h1>
      <div className="admin-cards">
        <div className="admin-card">
          <img src="https://media.post.rvohealth.io/wp-content/uploads/2020/08/Doctors_For_Men-732x549-thumbnail.jpg" alt="Doctor" className="card-image" />
          <div className="card-content">
            <h3>Doctors</h3>
            <Link to="/AllDoctors" className="card-link">View Doctors</Link>
          </div>
        </div>
        <div className="admin-card">
          <img src="https://st2.depositphotos.com/4520249/7106/v/450/depositphotos_71066225-stock-illustration-people.jpg" alt="Users" className="card-image" />
          <div className="card-content">
            <h3>Users</h3>
            <Link to="/Users" className="card-link">View Users</Link>
          </div>
        </div>
        <div className="admin-card">
          <img src="https://cache.aapc.com/blog/wp-content/uploads/2022/06/21114855/Take-Your-Provider-Queries-to-the-Next-Level.jpg" alt="Queries" className="card-image" />
          <div className="card-content">
            <h3>Queries</h3>
            <Link to="/quries" className="card-link">View Queries</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
