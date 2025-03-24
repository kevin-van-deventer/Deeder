import React, { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

// Imported Pages
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Dashboard from "./pages/Dashboard"
import MapsPage from "./pages/MapsPage"
import ChatPage from "./pages/ChatPage"

// Components
import Navbar from "./components/NavBar"

const AppRouter = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setUser(token ? true : null)
    setLoading(false)
  }, []) // ✅ Runs only once on mount

  // const ProtectedRoute = ({ user, children }) => {
  //   if (loading) return null
  //   return user ? children : <Navigate to="/login" />
  // }

  return (
    <Router>
      <Navbar />
      <Routes>
        <>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </>
      </Routes>
    </Router>
  )
}

export default AppRouter
