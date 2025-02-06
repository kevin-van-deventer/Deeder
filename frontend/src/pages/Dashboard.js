import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
    const [deeds, setDeeds] = useState([]);
    const token = localStorage.getItem("token");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.user_id);
        }
      }, [token]);

      useEffect(() => {
        if (userId) {
          const fetchDeeds = async () => {
            try {
              const response = await axios.get(`http://localhost:3000/users/${userId}/deeds`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setDeeds(response.data);
            } catch (error) {
              console.error("Error fetching deeds:", error);
            }
          };
    
          fetchDeeds();
        }
      }, [userId, token]);

    // handle the logout event
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };



    return (
        <div>
            <h2>Your Deeds</h2>
            <ul>
                {deeds.map((deed) => (
                <li key={deed.id}>
                    {deed.description} - <strong>{deed.status}</strong>
                </li>
                ))}
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
