import React, { useEffect, useState } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/NavBar"
import "./Dashboard.css" // Import the new CSS file
import { createConsumer } from "@rails/actioncable"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [deeds, setDeeds] = useState([])
  const [file, setFile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingDeed, setIsAddingDeed] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  })
  const [fulfilledDeeds, setFulfilledDeeds] = useState(0)
  const [unfulfilledDeeds, setUnfulfilledDeeds] = useState(0)
  const [deedsFulfilledForOthers, setDeedsFulfilledForOthers] = useState(0)
  const [volunteeredDeeds, setVolunteeredDeeds] = useState([])
  const [completedVolunteeredDeeds, setCompletedVolunteeredDeeds] = useState([])
  const [deedData, setDeedData] = useState({
    description: "",
    deed_type: "one-time",
    address: "",
    latitude: "",
    longitude: "",
  })

  // Text-area auto-resize function
  const handleAutoResize = (e) => {
    e.target.style.height = "auto" // Reset height to allow shrinking
    e.target.style.height = e.target.scrollHeight + "px" // Adjust height to fit content
  }

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token)
      fetchUserDetails(decodedToken.user_id)
      fetchDeeds(decodedToken.user_id)
    }

    // Set up ActionCable to listen for deed updates
    const cable = createConsumer(
      `${process.env.REACT_APP_WS_BASE_URL}?token=${token}`
    )
    // console.log("Created Action Cable consumer")
    // console.log(cable)

    const deedsChannel = cable.subscriptions.create(
      { channel: "DeedsChannel" },
      {
        connected() {
          console.log("Connected to DeedsChannel")
        },
        disconnected() {
          console.log("Disconnected from DeedsChannel")
        },
        received(data) {
          console.log("Received deed update:", data)
          setDeeds(data.deeds)
        },
        // received: (data) => {
        //   console.log("Received deed update:", data)
        //   setDeeds(data.deeds)
        // },
      }
    )

    return () => {
      deedsChannel.unsubscribe()
    }
  }, [token])

  // fetch user details from api
  const fetchUserDetails = async (userId) => {
    if (!userId) return

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setUser(response.data)
      setFulfilledDeeds(response.data.fulfilled_deeds)
      setUnfulfilledDeeds(response.data.unfulfilled_deeds)
      setDeedsFulfilledForOthers(response.data.deeds_fulfilled_for_others)

      setFormData({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
      })

      // Fetch volunteered deeds
      const volunteeredResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/volunteered_deeds`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const allVolunteeredDeeds = volunteeredResponse.data
      // Filter only deeds where the user was the one who completed them
      const completedVolunteeredDeeds = allVolunteeredDeeds.filter(
        (deed) => deed.completed_by && deed.completed_by.id === userId
      )

      setVolunteeredDeeds(allVolunteeredDeeds)
      setCompletedVolunteeredDeeds(completedVolunteeredDeeds)
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  // Fetch deeds requested or volunteered by the user
  const fetchDeeds = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/deeds`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const volunteeredResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/volunteered_deeds`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      // if i want them to run in parallel to be more efficient
      // const [response, volunteeredResponse] = await Promise.all([
      //   axios.get(
      //     `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/deeds`,
      //     { headers: { Authorization: `Bearer ${token}` } }
      //   ),
      //   axios.get(
      //     `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/volunteered_deeds`,
      //     { headers: { Authorization: `Bearer ${token}` } }
      //   )
      // ]);

      setDeeds(response.data)
      setVolunteeredDeeds(volunteeredResponse.data)
    } catch (error) {
      console.error("Error fetching deeds:", error)
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // upload user id document/profile picture
  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  // handle updating user details
  const handleUpdate = async () => {
    try {
      const updateData = new FormData()
      updateData.append("user[first_name]", formData.first_name)
      updateData.append("user[last_name]", formData.last_name)
      updateData.append("user[email]", formData.email)
      if (file) updateData.append("user[id_document]", file)

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/users/${user.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      setIsEditing(false)
      fetchUserDetails(user.id)
    } catch (error) {
      console.error("Error updating user details:", error)
    }
  }

  const handleDeedChange = (e) => {
    setDeedData({ ...deedData, [e.target.name]: e.target.value })
  }

  // old coordinates and submit deed functions
  // Convert Address to Latitude & Longitude
  // const getCoordinatesFromAddress = async (address) => {
  //   const apiKey = "AIzaSyAx_Rbj5JBqB_QStMi27jDFWMf3HJ-aZm0"
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //     address
  //   )}&key=${apiKey}`
  //   try {
  //     const response = await axios.get(url)
  //     if (response.data.results.length > 0) {
  //       const location = response.data.results[0].geometry.location
  //       setDeedData((prevData) => ({
  //         ...prevData,
  //         latitude: location.lat,
  //         longitude: location.lng,
  //       }))
  //     } else {
  //       alert("Address not found. Please enter a valid address.")
  //     }
  //   } catch (error) {
  //     console.error("Error fetching coordinates:", error)
  //     alert("Could not fetch location. Try again.")
  //   }
  // }

  // Handle submitting a new deed request
  // const handleSubmitDeed = async () => {
  //   const token = localStorage.getItem("token")
  //   const decodedToken = jwtDecode(token)
  //   const userId = decodedToken.user_id

  //   if (!deedData.description || !deedData.deed_type) {
  //     alert("Please fill all fields")
  //     return
  //   }

  //   // Ensure latitude and longitude are set
  //   if (!deedData.latitude || !deedData.longitude) {
  //     alert("Please click 'Convert Address to Coordinates' first.")
  //     return
  //   }

  //   try {
  //     await axios.post(
  //       `${process.env.REACT_APP_API_BASE_URL}/deeds`,
  //       {
  //         deed: {
  //           description: deedData.description,
  //           deed_type: deedData.deed_type,
  //           latitude: deedData.latitude,
  //           longitude: deedData.longitude,
  //           address: deedData.address, // Include address
  //           requester_id: userId,
  //         },
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     // clear form fields
  //     setDeedData({
  //       description: "",
  //       deed_type: "one-time",
  //       address: "",
  //       latitude: "",
  //       longitude: "",
  //     })

  //     setIsAddingDeed(false)
  //     fetchDeeds(user.id)
  //     fetchUserDetails(user.id)

  //     // setTimeout(() => {
  //     //   window.location.reload()
  //     // }, 100)
  //   } catch (error) {
  //     console.error("Error submitting deed request:", error)
  //     alert("Failed to submit deed request.")
  //   }
  // }

  // Modified: Returns the location object instead of updating state directly.
  const getCoordinatesFromAddress = async (address) => {
    const apiKey = "AIzaSyAx_Rbj5JBqB_QStMi27jDFWMf3HJ-aZm0"
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
    try {
      const response = await axios.get(url)
      if (response.data.results.length > 0) {
        return response.data.results[0].geometry.location
      } else {
        throw new Error("Address not found. Please enter a valid address.")
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error)
      throw error
    }
  }

  // New combined function: converts address to coordinates and then submits the deed.
  const handleConvertAndSubmitDeed = async () => {
    if (!deedData.description || !deedData.deed_type || !deedData.address) {
      alert("Please fill all fields")
      return
    }

    try {
      // Await conversion so that we get the coordinates before submitting.
      const location = await getCoordinatesFromAddress(deedData.address)
      // Optionally update state (if you need to see the values in the form)
      setDeedData((prevData) => ({
        ...prevData,
        latitude: location.lat,
        longitude: location.lng,
      }))

      const token = localStorage.getItem("token")
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.user_id

      // Submit the deed using the returned coordinates
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/deeds`,
        {
          deed: {
            description: deedData.description,
            deed_type: deedData.deed_type,
            latitude: location.lat,
            longitude: location.lng,
            address: deedData.address,
            requester_id: userId,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      // Clear the form fields and close the modal
      setDeedData({
        description: "",
        deed_type: "one-time",
        address: "",
        latitude: "",
        longitude: "",
      })
      setIsAddingDeed(false)
      fetchDeeds(user.id)
      fetchUserDetails(user.id)
    } catch (error) {
      alert(error.message || "Failed to submit deed request.")
    }
  }

  const handleDeleteDeed = async (deedId) => {
    if (!window.confirm("Are you sure you want to delete this deed?")) return

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/users/${user.id}/deeds/${deedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      alert("Deed deleted successfully!")
      fetchDeeds(user.id)
      fetchUserDetails(user.id)
    } catch (error) {
      console.error(
        "Error deleting deed:",
        error.response?.data || error.message
      )
      alert("Failed to delete deed.")
    }
  }

  const handleCompleteDeed = async (deedId) => {
    if (
      !window.confirm("Are you sure you want to mark this deed as completed?")
    )
      return

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/deeds/${deedId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      alert(response.data.message)
      fetchDeeds(user.id) // Refresh the deeds list
    } catch (error) {
      console.error(
        "Error completing deed:",
        error.response?.data || error.message
      )
      alert("Failed to mark deed as completed.")
    }
  }
  // if a user wants to pre confirm before 5 users confirm
  // const handleConfirmCompletion = async (deedId) => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_BASE_URL}/deeds/${deedId}/confirm_complete`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )

  //     alert(response.data.message)
  //     fetchDeeds(user.id) // Refresh deeds list
  //   } catch (error) {
  //     console.error("Error confirming completion:", error)
  //     alert(error.response?.data?.error || "Failed to confirm completion.")
  //   }
  // }

  const handleRepostDeed = async (deedId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/deeds/${deedId}/repost`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      alert(response.data.message)
      fetchDeeds(user.id) // Refresh deeds list
    } catch (error) {
      console.error("Error reposting deed:", error)
      alert(error.response?.data?.error || "Failed to repost deed.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null) // Update user state to trigger re-render
    // setTimeout(() => {
    navigate("/login")
    // window.location.reload() // Ensure full reset
    // }, 100) // Delay to ensure state updates
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        {/* Top Section: Profile & Stats Side by Side */}
        <div className="top-section">
          {user && (
            <div className="profile-card">
              <h2
                style={{
                  textAlign: "center",
                  borderRadius: "10px",
                  marginTop: "5px",
                  marginBottom: "10px",
                  backdropFilter: "blur(10px)",
                  padding: "10px",
                }}
              >
                {user.first_name} {user.last_name}
              </h2>
              {user.id_document_url && (
                <div>
                  {/* <p>ID Document:</p> */}
                  {user.id_document_url.endsWith(".pdf") ? (
                    <a
                      href={user.id_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  ) : (
                    <img
                      src={user.id_document_url}
                      alt="ID Document"
                      className="profile-image"
                    />
                  )}
                </div>
              )}

              {isEditing ? (
                <>
                  <input
                    className="input-field"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                  <input
                    className="input-field"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                  <input
                    className="input-field"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <input
                    className="upload-label"
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={handleFileChange}
                  />
                  <button className="save-button" onClick={handleUpdate}>
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Update Details
                </button>
              )}
            </div>
          )}

          {/* Deeds Statistics */}
          <div className="stats-section">
            <h2>Deed Statistics</h2>
            <p>
              Unfulfilled:{" "}
              <strong className="statCount">{unfulfilledDeeds}</strong>
            </p>
            <p>
              Fulfilled: <strong className="statCount">{fulfilledDeeds}</strong>
            </p>
            <p>
              Deeds Fulfilled:{" "}
              <strong className="statCount">{deedsFulfilledForOthers}</strong>
            </p>
            <p>
              Volunteered:{" "}
              <strong className="statCount">{volunteeredDeeds.length}</strong>
            </p>
            <p>
              Volunteered Complete:{" "}
              <strong className="statCount">
                {completedVolunteeredDeeds.length}
              </strong>
            </p>
          </div>
        </div>

        {/* Bottom Section: Deeds List */}
        <div className="deeds-section">
          <h2
            style={{
              textAlign: "center",
              borderRadius: "10px",
              marginTop: "30px",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            Deeds
          </h2>
          {deeds.map((deed) => {
            console.log("Deed created at:", new Date(deed.created_at))
            console.log(
              "24 hours ago:",
              new Date(Date.now() - 24 * 60 * 60 * 1000)
            )
            const isExpired =
              new Date(deed.created_at) <
              new Date(Date.now() - 24 * 60 * 60 * 1000)
            return (
              <div className="deed-card" key={deed.id}>
                <p className="deedTitle">
                  {deed.description} - {deed.deed_type}
                </p>
                <p>
                  Status: <strong>{deed.completion_status}</strong>
                </p>
                {/* Show Volunteers */}
                <h3>
                  <strong>Volunteers:</strong>
                </h3>
                {deed.volunteers && deed.volunteers.length > 0 ? (
                  <ul>
                    {deed.volunteers.map((volunteer) => (
                      <p key={volunteer.id}>
                        {volunteer.first_name} {volunteer.last_name}
                      </p>
                    ))}
                  </ul>
                ) : (
                  <p>No volunteers yet.</p>
                )}
                {/* Show Repost Button Only for Expired Deeds */}
                {isExpired ? (
                  <>
                    <p>
                      <strong>Expired</strong>
                    </p>
                    {deed.status === "unfulfilled" && (
                      <button
                        className="repost-button"
                        onClick={() => handleRepostDeed(deed.id)}
                      >
                        Repost
                      </button>
                    )}
                  </>
                ) : null}

                {/* Mark as Completed Button */}
                {/* {deed.status === "unfulfilled" && ( */}
                {/* <button */}
                {/* className="complete-button" */}
                {/* // onClick={() => handleConfirmCompletion(deed.id)} */}
                {/* > */}
                {/* {deed.completion_status} */}
                {/* Mark as Completed */}
                {/* </button> */}
                {/* // )} */}

                {/* If deed is fulfilled, show confirmation */}
                {deed.status === "fulfilled" && (
                  <p style={{ color: "#00eeff" }}>✔ Deed Completed</p>
                )}

                <button
                  className="delete-button"
                  onClick={() => handleDeleteDeed(deed.id)}
                >
                  Delete
                </button>
              </div>
            )
          })}

          {/* <div className="deeds-section"> */}
          <button
            className="logout-button"
            onClick={() => setIsAddingDeed(!isAddingDeed)}
          >
            {isAddingDeed ? "Cancel" : "Add Deed"}
          </button>

          {isAddingDeed && (
            <div
              className="modal-overlay"
              onClick={() => setIsAddingDeed(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Request a Deed</h3>

                <textarea
                  // type="text"
                  name="description"
                  placeholder="Description"
                  value={deedData.description}
                  onChange={handleDeedChange}
                  onInput={handleAutoResize}
                  className="deed-input auto-expand"
                />
                <select
                  name="deed_type"
                  value={deedData.deed_type}
                  onChange={handleDeedChange}
                  className="deed-input"
                >
                  <option value="one-time">One-Time</option>
                  <option value="material">Material</option>
                </select>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter Address"
                  value={deedData.address}
                  onChange={handleDeedChange}
                  className="deed-input"
                />
                {/* <button
                  onClick={() => getCoordinatesFromAddress(deedData.address)}
                  className="deed-button"
                >
                  Convert Address to Coordinates
                </button> */}
                {/* <input
                  type="text"
                  name="latitude"
                  value={deedData.latitude}
                  placeholder="Latitude"
                  readOnly
                  className="deed-input hidden"
                />
                <input
                  type="text"
                  name="longitude"
                  value={deedData.longitude}
                  placeholder="Longitude"
                  readOnly
                  className="deed-input hidden"
                /> */}
                <button
                  onClick={handleConvertAndSubmitDeed}
                  // disabled={!deedData.latitude || !deedData.longitude}
                  className="deed-button"
                >
                  Submit Deed
                </button>
                <button
                  onClick={() => setIsAddingDeed(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* volunteered deeds */}
        <div className="deeds-section">
          <h2
            style={{
              textAlign: "center",
              borderRadius: "10px",
              marginTop: "30px",
              marginBottom: "10px",
              backdropFilter: "blur(10px)",
              padding: "10px",
            }}
          >
            Volunteered Deeds
          </h2>
          <ul className="deed-card" style={{ listStyleType: "none" }}>
            {volunteeredDeeds.length > 0 ? (
              volunteeredDeeds.map((deed) => (
                <li key={deed.id} className="deed-card">
                  {/* <p>Deed requesters name</p> */}
                  <p>
                    {deed.description} - {deed.deed_type}
                  </p>
                  <p>Address: {deed.address}</p>
                  <p>
                    Status: <strong>{deed.status}</strong>
                  </p>
                  {deed.status === "fulfilled" && (
                    <p style={{ color: "#00eeff" }}>✔ Deed Completed</p>
                  )}
                  {deed.status === "unfulfilled" && (
                    <button
                      className="complete-button"
                      onClick={() => handleCompleteDeed(deed.id)}
                    >
                      Mark as Completed
                    </button>
                  )}
                  {/* navigate user to chat page */}
                  <button
                    className="chat-button"
                    onClick={() => navigate("/chat")}
                  >
                    Chat
                  </button>

                  {/* <button className="complete-button" onClick={() => handleCompleteDeed(deed.id)}>Mark as Completed</button> */}
                </li>
              ))
            ) : (
              <p>No deeds volunteered for yet.</p>
            )}
          </ul>
        </div>

        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
