import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Imported Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import MapsPage from "./pages/MapsPage";

// Components
import Navbar from "./components/NavBar";

const AppRouter = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(token ? true : null);
  }, []);  // ✅ Runs only once on mount
  
  const ProtectedRoute = ({ user, children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignupPage setUser={setUser} />} />
            {/* fallback route if user not logged in */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        <Route
          path="/maps"
          element={
            <ProtectedRoute user={user}>
              <MapsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
