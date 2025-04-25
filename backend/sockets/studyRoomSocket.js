const StudyRoom = require('../models/StudyRoom');
const User = require('../models/User');  

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinRoom', async ({ roomId, username }) => {
            try {
                const room = await StudyRoom.findById(roomId);
                if (!room) {
                    console.log(`Room with ID ${roomId} does not exist.`);
                    return socket.emit('error', { message: 'Room not found' });
                }

                socket.join(roomId);
                console.log(`${username} joined room: ${roomId}`);

                socket.to(roomId).emit('userJoined', { username, message: `${username} has joined the room` });

                const populatedRoom = await StudyRoom.findById(roomId).populate('messages.sender', 'username');
                socket.emit('loadMessages', populatedRoom ? populatedRoom.messages : []);
            } catch (error) {
                console.error('Error fetching messages or joining room:', error);
                socket.emit('error', { message: 'Error joining room' });
            }
        });

        socket.on('chatMessage', async ({ roomId, message, senderId }) => {
            const newMessage = {
                sender: senderId,  
                text: message,     
                timestamp: new Date(),
            };

            try {
                const room = await StudyRoom.findById(roomId);
                if (!room) {
                    console.log(`Room with ID ${roomId} not found.`);
                    return socket.emit('error', { message: 'Room not found' });
                }

                room.messages.push(newMessage);
                await room.save();

                io.to(roomId).emit('chatMessage', newMessage);
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', { message: 'Error sending message' });
            }
        });

        socket.on('leaveRoom', ({ roomId, username }) => {
            socket.leave(roomId);
            console.log(`${username} left room: ${roomId}`);

            socket.to(roomId).emit('userLeft', { username, message: `${username} has left the room` });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
