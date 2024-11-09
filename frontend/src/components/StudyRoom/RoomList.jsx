// src/components/StudyRoom/RoomList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/studyrooms');
        setRooms(response.data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="room-list">
      <h2>Study Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            <Link to={`/study-room/${room._id}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
