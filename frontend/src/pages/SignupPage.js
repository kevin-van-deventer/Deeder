import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// import components
import AuthForm from "../components/AuthForm";


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

  return <AuthForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} type="signup" />;
};

export default SignupPage;
