export const fetchMessages = async (chatRoomId) => {
    const response = await fetch(`/api/chat_rooms/${chatRoomId}/messages`);
    return response.json();
  };
  
  export const sendMessage = async (chatRoomId, message) => {
    const response = await fetch(`/api/chat_rooms/${chatRoomId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: message }),
    });
    return response.json();
  };