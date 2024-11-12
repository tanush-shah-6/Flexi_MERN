import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import './ChatRoom.css';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
});

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/studyrooms/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(response.data); // Set fetched messages with sender info
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Join the chat room
    socket.emit('joinRoom', { roomId });

    // Listen for incoming messages
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newMessage');
      socket.emit('leaveRoom', { roomId });
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
      };

      try {
        // Send the message to the server
        await axios.post(
          `http://localhost:5000/api/studyrooms/${roomId}/sendMessage`,
          message,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        // Clear the input field
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-room">
      <h2>Chat Room</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender?.username || 'Unknown'}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
