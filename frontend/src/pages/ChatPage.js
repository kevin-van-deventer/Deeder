import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createConsumer } from "@rails/actioncable";
import "./ChatPage.css"; 

const ChatPage = () => {
  const [user, setUser] = useState(null);
  const [deeds, setDeeds] = useState([]);
  const [volunteeredDeeds, setVolunteeredDeeds] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      fetchUserDetails(decodedToken.user_id);
      fetchDeeds(decodedToken.user_id);
    }
  }, [token]);

  // Fetch logged-in user details
  const fetchUserDetails = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch deeds created by logged-in user
  const fetchDeeds = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}/deeds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeeds(response.data);
      const volunteeredResponse = await axios.get(`http://localhost:3000/users/${userId}/volunteered_deeds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setVolunteeredDeeds(volunteeredResponse.data);
    } catch (error) {
      console.error("Error fetching deeds:", error);
    }
  };

  // Start chat with a volunteer
  const handleStartChat = async (deed, volunteer) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/chat_rooms`,
        { deed_id: deed.id, recipient_id: volunteer.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setChatRoom(response.data.chat_room);
      setMessages(response.data.messages);
      setSelectedChatUser(volunteer);
  
      // Setup WebSocket connection for real-time messages
      const cable = createConsumer("ws://localhost:3000/cable");
      cable.subscriptions.create(
        { channel: "ChatRoomChannel", id: response.data.chat_room.id },
        {
          received: (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          },
        }
      );
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat.");
    }
  };
  

  // Send a message
  const handleSendMessage = async () => {
    if (!messageContent.trim() || !chatRoom) return;
    
    try {
      await axios.post(
        `http://localhost:3000/chat_rooms/${chatRoom.id}/messages`,
        { content: messageContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessageContent(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="chat-container">
      {/* Left Column - List of Volunteers */}
      <div className="volunteer-column">
        <h2>My Volunteers</h2>
        {deeds.length > 0 ? (
          deeds.map((deed) => (
            <div key={deed.id} className="deed-card">
              <h3>{deed.description}</h3>
              {/* List of Volunteers */}
              {deed.volunteers.length > 0 ? (
                <div className="volunteer-list">
                  {deed.volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="volunteer-item">
                      <p>{volunteer.first_name} {volunteer.last_name}</p>
                      <button
                        className="chat-button"
                        onClick={() => handleStartChat(deed, deed.volunteers[0])}
                      >
                        Chat with {volunteer.first_name}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No volunteers yet.</p>
              )}
            </div>
          ))
        ) : (
          <p>No deeds found.</p>
        )}
        {volunteeredDeeds.length > 0 ? (
          volunteeredDeeds.map((deed) => (
            <div key={deed.id} className="deed-card">
              <h3>{deed.description}</h3>
              {/* List of Volunteers */}
                <div className="volunteer-list">
                    <div key={deed.id} className="volunteer-item">
                      <button
                        className="chat-button"
                        onClick={() => handleStartChat(deed, user)}
                      >
                        Chat
                      </button>
                    </div>
                </div>
            </div>
          ))
        ) : (
          <p>No deeds found.</p>
        )}
      </div>

      {/* Right Column - Chat Messages */}
      <div className="chat-column">
        <h2>Chat Window</h2>
        {chatRoom ? (
          <div>
            <h3 style={{ color: "black" }}>Chat with {selectedChatUser?.first_name}</h3>
            <div className="chat-box">
              {messages.map((msg, index) => (
                <p style={{ color: "black" }} key={index} className={msg.sender_id === user.id ? "outgoing" : "incoming"}>
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
  );
};

export default ChatPage;
