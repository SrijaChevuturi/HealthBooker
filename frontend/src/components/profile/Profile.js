import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';

function Profile() {
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/user-api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        const result = await response.json();
        if (response.ok) {
          setFormDetails({
            firstname: result.user.firstname || "",
            lastname: result.user.lastname || "",
            email: result.user.email || "",
            age: result.user.age || "",
            mobile: result.user.mobile || "",
            gender: result.user.gender || "neither",
            address: result.user.address || "",
            password: "",
            confpassword: "",
          });
        } else {
          alert(`Error fetching profile: ${result.message || result.error}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return alert("User not authenticated");
      }

      const response = await fetch("http://localhost:3000/user-api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formDetails),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Profile updated successfully");
        navigate("/"); // Navigate to home page
      } else {
        alert(`Error updating profile: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="profile-section flex-center">
      <div className="profile-container flex-center">
        <h2 className="pform-heading">Profile</h2>
        <img
          src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
          alt="profile"
          className="profile-pic"
        />
        <form onSubmit={formSubmit} className="profile-form">
          <div className="form-same-row">
            <input
              type="text"
              name="firstname"
              className="pform-input"
              placeholder="Enter your first name"
              value={formDetails.firstname}
              onChange={inputChange}
            />
            <input
              type="text"
              name="lastname"
              className="pform-input"
              placeholder="Enter your last name"
              value={formDetails.lastname}
              onChange={inputChange}
            />
          </div>
          <div className="form-same-row">
            <input
              type="email"
              name="email"
              className="pform-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
            />
            <select
              name="gender"
              value={formDetails.gender}
              className="pform-input"
              id="gender"
              onChange={inputChange}
            >
              <option value="neither">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="form-same-row">
            <input
              type="text"
              name="age"
              className="pform-input"
              placeholder="Enter your age"
              value={formDetails.age}
              onChange={inputChange}
            />
            <input
              type="text"
              name="mobile"
              className="pform-input"
              placeholder="Enter your mobile number"
              value={formDetails.mobile}
              onChange={inputChange}
            />
          </div>
          <textarea
            type="text"
            name="address"
            className="form-input"
            placeholder="Enter your address"
            value={formDetails.address}
            onChange={inputChange}
            rows="2"
          ></textarea>
          <div className="form-same-row">
            <input
              type="password"
              name="password"
              className="pform-input"
              placeholder="Enter your password"
              value={formDetails.password}
              onChange={inputChange}
            />
            <input
              type="password"
              name="confpassword"
              className="pform-input"
              placeholder="Confirm your password"
              value={formDetails.confpassword}
              onChange={inputChange}
            />
          </div>
          <button type="submit" className="pbtn form-btn">
            Update
          </button>
        </form>
      </div>
    </section>
  );
}

export default Profile;
