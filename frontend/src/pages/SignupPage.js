import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = ({ setUser }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/users", {
        user: formData,
      });
      localStorage.setItem("token", response.data.token);
      setUser(true);
      navigate("/dashboard");
    } catch (error) {
      alert("Signup failed: " + error.response.data.errors.join(", "));
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="password_confirmation" placeholder="Confirm Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default SignupPage;
