// src/pages/ChatPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import consumer from "../services/actionCableConsumer";
import { fetchMessages, sendMessage } from "../services/chatApi";

const ChatPage = () => {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMessages(chatRoomId).then(setMessages);

    const subscription = consumer.subscriptions.create(
      { channel: "ChatRoomChannel", id: chatRoomId },
      {
        received: (data) => {
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
    if (!newMessage.trim()) return;
    await sendMessage(chatRoomId, newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
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
