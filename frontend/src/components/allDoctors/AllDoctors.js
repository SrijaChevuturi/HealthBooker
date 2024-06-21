import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllDoctors.css'; // Make sure to create and style this CSS file

function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    doctorname: '',
    specialization: '',
    experience: '',
    fees: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/doctor-api/doctors');
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/admin-api/add-doctor', newDoctor, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Doctor added successfully');
      setError('');
      setNewDoctor({ doctorname: '', specialization: '', experience: '', fees: '', phone: '' });
      fetchDoctors();
    } catch (error) {
      console.error('Error adding doctor:', error);
      setError('Failed to add doctor. Make sure the phone number is unique.');
      setSuccess('');
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin-api/delete-doctor/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Doctor deleted successfully');
      setError('');
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Failed to delete doctor.');
      setSuccess('');
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="doctors-list">
        {doctors.map(doctor => (
          <div key={doctor._id} className="doctor-card">
            <h2>Dr {doctor.doctorname}</h2>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Experience:</strong> {doctor.experience}yrs</p>
            <p><strong>Fees:</strong>${doctor.fees}</p>
            <p><strong>Contact:</strong> {doctor.phone}</p>
            <button onClick={() => handleDeleteDoctor(doctor._id)}>Delete</button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddDoctor} className="add-doctor-form">
        <h2 className='m-3'>Add New Doctor</h2>
        <input
          type="text"
          name="doctorname"
          placeholder="Doctor Name"
          value={newDoctor.doctorname}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={newDoctor.specialization}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={newDoctor.experience}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="fees"
          placeholder="Fees"
          value={newDoctor.fees}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newDoctor.phone}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
}

export default AllDoctors;
