import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RoomList.css';

const RoomList = () => {
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
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
    navigate(`/chat-room/${roomId}`);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
        await axios.delete(`http://localhost:5000/api/studyrooms/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setJoinedRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
        setErrorMessage(''); // Clear any previous error messages on success
    } catch (err) {
        if (err.response && err.response.status === 403) {
            setErrorMessage('Unauthorized user: You are not allowed to delete this room.');
        } else {
            setErrorMessage('Error deleting room. Please try again.');
        }
    }
};

const handleEditTopic = async (roomId, newTopic) => {
  try {
      const response = await axios.patch(
          `http://localhost:5000/api/studyrooms/${roomId}/edit-topic`,
          { topic: newTopic },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      setJoinedRooms((prevRooms) =>
          prevRooms.map((room) =>
              room._id === roomId ? { ...room, topic: response.data.room.topic } : room
          )
      );
      setErrorMessage(''); // Clear any previous error messages on success
  } catch (err) {
      if (err.response && err.response.status === 403) {
          setErrorMessage('Unauthorized user: You are not allowed to edit this room.');
      } else {
          setErrorMessage('Error updating topic. Please try again.');
      }
  }
};

  return (
    <div className="room-list">
      <h2>Your Joined Study Rooms</h2>

      {/* Display the error message if present */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

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
                <button onClick={() => handleEditTopic(room._id, prompt("Enter new topic:"))} className="edit-button">
                    Edit Topic
                </button>
                <button onClick={() => handleDeleteRoom(room._id)} className="delete-button">
                    Delete Room
                </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
