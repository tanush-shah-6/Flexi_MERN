const StudyRoom = require('../models/StudyRoom');
const User = require('../models/User');  // Assuming you have a User model for referencing users

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Join a study room
        socket.on('joinRoom', async ({ roomId, username }) => {
            try {
                const room = await StudyRoom.findById(roomId);
                if (!room) {
                    console.log(`Room with ID ${roomId} does not exist.`);
                    return socket.emit('error', { message: 'Room not found' });
                }

                socket.join(roomId);
                console.log(`${username} joined room: ${roomId}`);

                // Broadcast to other users in the room that a new user has joined
                socket.to(roomId).emit('userJoined', { username, message: `${username} has joined the room` });

                // Fetch and send existing messages in the room
                const populatedRoom = await StudyRoom.findById(roomId).populate('messages.sender', 'username');
                socket.emit('loadMessages', populatedRoom ? populatedRoom.messages : []);
            } catch (error) {
                console.error('Error fetching messages or joining room:', error);
                socket.emit('error', { message: 'Error joining room' });
            }
        });

        // Handle chat messages
        socket.on('chatMessage', async ({ roomId, message, senderId }) => {
            // Ensure senderId is the ObjectId of the sender user
            const newMessage = {
                sender: senderId,  // This should be the ObjectId of the sender
                text: message,     // This should be a string message
                timestamp: new Date(),
            };

            try {
                // Fetch the room and check if it exists
                const room = await StudyRoom.findById(roomId);
                if (!room) {
                    console.log(`Room with ID ${roomId} not found.`);
                    return socket.emit('error', { message: 'Room not found' });
                }

                // Save the message to the database
                room.messages.push(newMessage);
                await room.save();

                // Emit the message to all users in the room
                io.to(roomId).emit('chatMessage', newMessage);
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', { message: 'Error sending message' });
            }
        });

        // Leaving a room
        socket.on('leaveRoom', ({ roomId, username }) => {
            socket.leave(roomId);
            console.log(`${username} left room: ${roomId}`);

            // Notify others in the room that the user has left
            socket.to(roomId).emit('userLeft', { username, message: `${username} has left the room` });
        });

        // Handle client disconnect
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
