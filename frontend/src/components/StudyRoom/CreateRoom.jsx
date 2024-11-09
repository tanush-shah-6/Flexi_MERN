import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateRoom.css';  // If you want to style the form

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState('');  // Add a state to capture the topic
  const navigate = useNavigate();

  // Handle room creation
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');  // Retrieve the token from localStorage
    
    if (!token) {
      alert("You need to be logged in to create a room.");
      return;
    }

    try {
      // Send a POST request to create the room with the Authorization header
      const response = await axios.post(
        'http://localhost:5000/api/studyrooms/create',
        { name: roomName, topic: topic },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Attach token in the headers
          },
        }
      );
      
      // Redirect to the study room chat page after successful room creation
      navigate(`/study-room/${response.data._id}`);
    } catch (err) {
      console.error('Error creating room:', err);
      alert('Error creating the room');
    }
  };

  return (
    <div className="create-room-form">
      <h2>Create Study Room</h2>
      <form onSubmit={handleCreateRoom}>
        <div className="form-group">
          <label htmlFor="roomName">Room Name</label>
          <input
            type="text"
            id="roomName"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            type="text"
            id="topic"
            placeholder="Enter Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;
