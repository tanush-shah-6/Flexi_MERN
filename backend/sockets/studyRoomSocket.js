const StudyRoom = require('../models/StudyRoom');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (io) => {
  // Add authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach user info to socket
      socket.userId = user._id;
      socket.username = user.username;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id, 'User:', socket.username);

    socket.on('joinRoom', async ({ roomId }) => {
      try {
        const room = await StudyRoom.findById(roomId);
        if (!room) {
          console.log(`Room with ID ${roomId} does not exist.`);
          return socket.emit('error', { message: 'Room not found' });
        }

        socket.join(roomId);
        console.log(`${socket.username} (${socket.userId}) joined room: ${roomId}`);

        // Notify others in the room
        socket.to(roomId).emit('userJoined', { 
          username: socket.username, 
          userId: socket.userId,
          message: `${socket.username} has joined the room` 
        });

        // Send existing messages to the joining user
        const populatedRoom = await StudyRoom.findById(roomId)
          .populate({
            path: 'messages.sender',
            select: 'username _id'
          });
          
        socket.emit('loadMessages', populatedRoom ? populatedRoom.messages : []);
      } catch (error) {
        console.error('Error fetching messages or joining room:', error);
        socket.emit('error', { message: 'Error joining room' });
      }
    });

    socket.on('chatMessage', async ({ roomId, message }) => {
      // Create message with proper sender info
      const newMessage = {
        sender: socket.userId,
        text: message,
        timestamp: new Date(),
      };

      try {
        // Save to database
        const room = await StudyRoom.findById(roomId);
        if (!room) {
          console.log(`Room with ID ${roomId} not found.`);
          return socket.emit('error', { message: 'Room not found' });
        }

        room.messages.push(newMessage);
        await room.save();

        // Populate sender info before broadcasting
        const user = await User.findById(socket.userId).select('username _id');
        
        // Broadcast to all clients in the room including sender
        io.to(roomId).emit('newMessage', {
          ...newMessage,
          sender: {
            _id: user._id,
            username: user.username
          }
        });
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    socket.on('leaveRoom', ({ roomId }) => {
      socket.leave(roomId);
      console.log(`${socket.username} left room: ${roomId}`);

      socket.to(roomId).emit('userLeft', { 
        username: socket.username,
        userId: socket.userId,
        message: `${socket.username} has left the room` 
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id, 'User:', socket.username);
    });
  });
};
