import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import AuthForm from "../components/AuthForm"

import "./LoginSignup.css"

const LoginPage = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        formData
      )
      localStorage.setItem("token", response.data.token)
      setUser(true)
      navigate("/dashboard")
    } catch (error) {
      alert("Login failed: " + error.response.data.error)
    }
  }

  return (
    <AuthForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      type="login"
    />
  )
}

export default LoginPage
