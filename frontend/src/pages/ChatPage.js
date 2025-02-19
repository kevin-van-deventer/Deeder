import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import consumer from "../services/actionCableConsumer";
import axios from "axios";

const ChatPage = () => {
  const { requesterId, volunteerId } = useParams(); // Get user IDs from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/chat_rooms`,
          { deed_id: requesterId }, // Use requesterId to find the deed
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setChatRoomId(response.data.chat_room.id);
        fetchMessages(response.data.chat_room.id);
      } catch (error) {
        console.error("Error fetching chat room:", error);
      }
    };

    const fetchMessages = async (chatRoomId) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat_rooms/${chatRoomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchChatRoom();
  }, [requesterId, token]);

  useEffect(() => {
    if (!chatRoomId) return;

    const subscription = consumer.subscriptions.create(
      { channel: "ChatRoomChannel", id: chatRoomId },
      {
        received(data) {
          setMessages((prev) => [...prev, data.message]);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [chatRoomId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatRoomId) return;

    try {
      await axios.post(
        `http://localhost:3000/chat_rooms/${chatRoomId}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user.name}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
