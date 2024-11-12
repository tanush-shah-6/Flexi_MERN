// src/components/StudyRoom/RoomList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RoomList.css';

const RoomList = () => {
  const [joinedRooms, setJoinedRooms] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get the user token

  useEffect(() => {
    const fetchJoinedRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/studyrooms/joined', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJoinedRooms(response.data);
      } catch (err) {
        console.error('Error fetching joined rooms:', err);
      }
    };
    fetchJoinedRooms();
  }, [token]);

  const handleGoToChatRoom = (roomId) => {
    navigate(`/study-room/${roomId}`);
  };

  return (
    <div className="room-list">
      <h2>Your Joined Study Rooms</h2>
      {joinedRooms.length === 0 ? (
        <p>No joined rooms available. Join a room to start collaborating!</p>
      ) : (
        <div className="room-cards">
          {joinedRooms.map((room) => (
            <div key={room._id} className="room-card">
              <h3>{room.name}</h3>
              <p><strong>Topic:</strong> {room.topic}</p>
              <button onClick={() => handleGoToChatRoom(room._id)} className="chat-button">
                Go to Chat Room
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
