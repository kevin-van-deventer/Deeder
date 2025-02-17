import React, { useEffect, useState } from "react";
import { createConsumer } from "@rails/actioncable";

import axios from "axios";
import { GoogleMap, Marker, InfoWindow, LoadScriptNext } from "@react-google-maps/api";
import { jwtDecode } from "jwt-decode";

import Navbar from "../components/NavBar";
import "./MapsPage.css";



const mapContainerStyle = { width: "100%", height: "100vh", position: "relative" };
const defaultCenter = { lat: -25.7479, lng: 28.2293 }; // Default center (Pretoria, South Africa)

const oneTimeIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"; // Blue marker for one-time deeds
const materialIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // Green marker for material deeds

const MapsPage = () => {
  const [deeds, setDeeds] = useState([]);
  const [selectedDeed, setSelectedDeed] = useState(null);
  const [unfulfilledDeeds, setUnfulfilledDeeds] = useState(0);
  const [userLocation, setUserLocation] = useState(defaultCenter); // Store user’s live location

  const apiKey = "AIzaSyAx_Rbj5JBqB_QStMi27jDFWMf3HJ-aZm0"; // Replace with your actual API key
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).user_id : null;

  useEffect(() => {
    fetchDeeds();
    getUserLocation(); // Get user’s live location
    const token = localStorage.getItem("token");
    // ✅ Set up WebSocket subscription once
    const cable = createConsumer(`ws://localhost:3000/cable?token=${token}`); // Adjust URL if needed
    const subscription = cable.subscriptions.create("DeedsChannel", {
      received: (data) => {
        console.log("WebSocket Update Received:", data);
        setDeeds(data.deeds);
        setUnfulfilledDeeds(data.unfulfilled_count);
      }
    });

    return () => {
      subscription.unsubscribe(); // Cleanup WebSocket on unmount
    };
  }, []);

  // Fetch all unfulfilled deeds with lat/lon
  const fetchDeeds = async () => {
    try {
      const response = await axios.get("http://localhost:3000/deeds");
      setDeeds(response.data);
      setUnfulfilledDeeds(response.data.filter((deed) => deed.status === "unfulfilled").length);
    } catch (error) {
      console.error("Error fetching deeds:", error);
    }
  };

  // Handle volunteer request
  const handleVolunteer = async (deedId, requesterId) => {
    if (userId === requesterId) {
      alert("You cannot volunteer for your own deed.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/deeds/${deedId}/volunteer`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      fetchDeeds(); // Refresh deeds list
    } catch (error) {
      console.error("Error volunteering:", error);
      alert(error.response?.data?.error || "Failed to volunteer.");
    }
  };

  // Get user's live location using the Geolocation API
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation denied or unavailable:", error);
          setUserLocation(defaultCenter); // Fallback to default location
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(defaultCenter);
    }
  };

  return (
    <div className="maps-page">
      <Navbar />

      {/* Flex Container for Map and Latest Deeds */}
      <div className="map-deeds-container">
        {/* Left Side: Map */}
        <div className="map-container">
          <LoadScriptNext googleMapsApiKey={apiKey}>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={userLocation}>
              {deeds.map((deed) => (
                <Marker
                  key={deed.id}
                  position={{ lat: parseFloat(deed.latitude), lng: parseFloat(deed.longitude) }}
                  onClick={() => setSelectedDeed(deed)}
                  icon={deed.deed_type === "one-time" ? oneTimeIcon : materialIcon} // Set marker icon based on deed type
                />
              ))}

              {selectedDeed && (
                <InfoWindow position={{ lat: parseFloat(selectedDeed.latitude), lng: parseFloat(selectedDeed.longitude) }} onCloseClick={() => setSelectedDeed(null)}>
                  <div>
                    <p><strong>{selectedDeed.description}</strong></p>
                    <p><strong>{selectedDeed.deed_type}</strong></p>
                    <p><strong>Deeders:</strong> {selectedDeed.volunteer_count}</p>

                    {userId && selectedDeed.requester_id !== userId && (
                      <button onClick={() => handleVolunteer(selectedDeed.id, selectedDeed.requester_id)}>Accept</button>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScriptNext>
        </div>

        {/* Right Side: Latest Deeds */}
        <div className="deeds-list">
          <h2>Deeds ({unfulfilledDeeds})</h2>
          {deeds.length === 0 ? <p>No deeds available.</p> : (
            deeds.map((deed) => (
              <div key={deed.id} className="deed-card">
                <p><strong>{deed.description}</strong></p>
                <p>{deed.address}</p>
                <p><strong>Type:</strong> {deed.deed_type}</p>
                <button id="deedButton" onClick={() => handleVolunteer(deed.id, deed.requester_id)}>Accept</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MapsPage;
