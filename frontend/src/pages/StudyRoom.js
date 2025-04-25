import React, { useState } from 'react';
import CreateRoom from '../components/StudyRoom/CreateRoom';
import RoomList from '../components/StudyRoom/RoomList';
import JoinRoom from '../components/StudyRoom/JoinRoom';
import StudyRoomChat from '../components/StudyRoom/StudyRoomChat';
import { useNavigate } from 'react-router-dom';
import './Tools.css';
import 'font-awesome/css/font-awesome.min.css';

const StudyRoom = () => {
    const [activeTab, setActiveTab] = useState("room-list");
    const navigate = useNavigate();

    const predefinedRoomId = "12345"; 

    const handleJoinRoom = () => {
        navigate(`/study-room-chat/${predefinedRoomId}`);
    };

    return (
        <div>
            <h1>Study Rooms</h1>
            <div className="tab-buttons">
                <button onClick={() => setActiveTab("room-list")}>Room List</button>
                <button onClick={() => setActiveTab("create-room")}>Create Room</button>
                <button onClick={() => setActiveTab("join-room")}>Join Room</button>
            </div>
            <div className="tab-content">
                {activeTab === "room-list" && <RoomList />}
                {activeTab === "create-room" && <CreateRoom />}
                {activeTab === "join-room" && (
                    <JoinRoom onJoinRoom={handleJoinRoom} />
                )}
                {activeTab === "study-room-chat" && <StudyRoomChat />}
            </div>
        </div>
    );
};

export default StudyRoom;
