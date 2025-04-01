import React, { useEffect, useState } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { createConsumer } from "@rails/actioncable"
import "./ChatPage.css"

const ChatPage = () => {
  const [user, setUser] = useState(null)
  const [deeds, setDeeds] = useState([])
  const [volunteeredDeeds, setVolunteeredDeeds] = useState([])
  const [chatRoom, setChatRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageContent, setMessageContent] = useState("")
  const [selectedChatUser, setSelectedChatUser] = useState(null)
  const [subscription, setSubscription] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token)
      fetchUserDetails(decodedToken.user_id)
      fetchDeeds(decodedToken.user_id)
    }
  }, [token])

  // clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [subscription])

  // Fetch logged-in user details
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
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  // Fetch deeds created by logged-in user
  const fetchDeeds = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/deeds`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setDeeds(response.data)
      const volunteeredResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/volunteered_deeds`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setVolunteeredDeeds(volunteeredResponse.data)
    } catch (error) {
      console.error("Error fetching deeds:", error)
    }
  }

  // Start chat with a volunteer
  const handleStartChat = async (deed, volunteer) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/chat_rooms`,
        { deed_id: deed.id, recipient_id: volunteer.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setChatRoom(response.data.chat_room)
      setMessages(response.data.messages)
      setSelectedChatUser(volunteer)
      // Setup WebSocket connection for real-time messages
      const cable = createConsumer(
        `${process.env.REACT_APP_WS_BASE_URL}?token=${token}`
      )
      const chatSubscriptions = cable.subscriptions.create(
        { channel: "ChatRoomChannel", id: response.data.chat_room.id },
        {
          received: (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
            setChatRoom(response.data.chat_room)
            // const prevMessages = [...prev]
          },
        }
      )
      setSubscription(chatSubscriptions)
      return () => {
        chatSubscriptions.unsubscribe() // Cleanup WebSocket on unmount
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      alert("Failed to start chat.")
    }
  }

  // Determine a color for a each user ID
  const getColorForUser = (userId) => {
    // List of colors
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#33FFF3"]

    // Convert non-numeric IDs to a numeric
    const numericId =
      typeof userId === "number"
        ? userId
        : Array.from(String(userId)).reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          )

    // Use modulus to cycle through colors
    return colors[numericId % colors.length]
  }

  // Send a message
  const handleSendMessage = async () => {
    if (!messageContent.trim() || !chatRoom) return
    // console.log("send msg");
    const newMessage = {
      sender_id: user.id,
      content: messageContent,
    }

    // Optimistically update UI before sending request
    setMessages((prevMessages) => [...prevMessages, newMessage])
    const contentToSend = messageContent
    setMessageContent("") // Clear input field

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/chat_rooms/${chatRoom.id}/messages`,
        { content: contentToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message.")
    }
  }

  return (
    <div className="chat-container">
      {/* Left Column - List of Volunteers */}
      <div className="volunteer-column">
        <h2>Deeds</h2>
        {deeds.length > 0 ? (
          deeds.map((deed) => (
            <div key={deed.id} className="user-card">
              <h4 className="user-list-descrip">{deed.description}</h4>
              {/* List of Volunteers */}
              {deed.volunteers.length > 0 ? (
                <div className="volunteer-list">
                  {/* TODO Only one chat button*/}
                  {deed.volunteers.map((volunteer, index) => (
                    <div key={volunteer.id} className="volunteer-item">
                      <span>
                        {volunteer.first_name} {volunteer.last_name}
                      </span>
                      <button
                        className="chat-button"
                        onClick={() => handleStartChat(deed, volunteer)}
                      >
                        Chat
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No volunteers yet.</p>
              )}
              <button
                className="chat-button"
                onClick={() => handleStartChat(deed, deed.volunteers[0])}
              >
                Chat
              </button>
            </div>
          ))
        ) : (
          <p>No deeders yet.</p>
        )}
        <h2>Deeders</h2>
        {volunteeredDeeds.length > 0 ? (
          volunteeredDeeds.map((deed) => (
            <div key={deed.id} className="deed-card">
              <h4 className="user-list-descrip">{deed.description}</h4>
              {/* List of Volunteers */}
              <div className="volunteer-list">
                <div key={deed.id} className="volunteer-item">
                  <button
                    className="chat-button"
                    onClick={() => handleStartChat(deed, user)}
                  >
                    Chat Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No deeders found.</p>
        )}
      </div>

      {/* Right Column - Chat Messages */}
      <div className="chat-column">
        <h2>Chat Window</h2>
        {chatRoom ? (
          <div>
            {/* <h3 style={{ color: "black" }}>Discuss The Deed Details:</h3> */}
            <div className="chat-box">
              {messages
                .filter(
                  (msg, index, arr) =>
                    msg?.content &&
                    msg.content.trim() && // Remove undefined, null, and blank messages
                    (index === 0 || msg.content !== arr[index - 1]?.content) // Remove consecutive duplicates
                )
                .map((msg, index) => (
                  <p
                    key={index}
                    className={
                      msg.sender_id === user.id ? "outgoing" : "incoming"
                    }
                    style={{ color: getColorForUser(msg.sender_id) }}
                  >
                    {msg.content}
                  </p>
                ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <p>Select a volunteer to start a chat.</p>
        )}
      </div>
    </div>
  )
}

export default ChatPage
