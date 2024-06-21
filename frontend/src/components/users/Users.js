import React, { useEffect, useState } from 'react';
import axiosWithToken from '../../axiosWithToken';
import './Users.css'; // Import the CSS file for styling

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axiosWithToken.get('http://localhost:3000/admin-api/view-users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axiosWithToken.delete(`http://localhost:3000/admin-api/delete-user/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="users-container">
      {users.map(user => (
        <div key={user._id} className="user-card">
          <h3>{user.firstname} {user.lastname}</h3>
          <p>Email: {user.email}</p>
          <p>Phone: {user.mobile}</p>
          <p>Age: {user.age}</p>
          <p>Gender: {user.gender}</p>
          <p>Address: {user.address}</p>
          <button className="delete-button" onClick={() => handleDelete(user._id)}>Delete User</button>
        </div>
      ))}
    </div>
  );
}

export default Users;
