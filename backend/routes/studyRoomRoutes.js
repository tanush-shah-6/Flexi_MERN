const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');
const authenticate = require('../middleware/authenticate');

module.exports = (io) => {
    // Create a new study room
    router.post('/create', authenticate, async (req, res) => {
        const { name, topic } = req.body;
        try {
            const creator = req.user._id;

            const room = new StudyRoom({
                name,
                topic,
                members: [creator], // Add the creator as a participant
                createdBy: creator, // Store the creator's ID
            });

            await room.save();

            // Emit room creation event to all clients
            io.emit('roomCreated', room);

            res.status(201).json(room);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating room' });
        }
    });

    // Join a study room
    router.post('/:roomId/join', authenticate, async (req, res) => {
        const { roomId } = req.params;
        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Prevent the user from joining the room if they are already a member
            if (room.members.includes(req.user._id)) {
                return res.status(400).json({ error: 'Already a member of this room' });
            }

            room.members.push(req.user._id); // Add the user to the room's members
            await room.save();

            // Emit a 'user joined' event to the room
            io.to(roomId).emit('userJoined', { userId: req.user._id, roomId });

            res.status(200).json(room); // Return the updated room data
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error joining room' });
        }
    });

    // Leave a study room
    router.post('/:roomId/leave', authenticate, async (req, res) => {
        const { roomId } = req.params;
        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Remove the user from the room's participants
            room.members = room.members.filter(member => member.toString() !== req.user._id.toString());
            await room.save();

            // Emit a 'user left' event to the room
            io.to(roomId).emit('userLeft', { userId: req.user._id, roomId });

            res.status(200).json({ message: 'Left room successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error leaving room' });
        }
    });

    // Get all study rooms the user has joined
    router.get('/joined', authenticate, async (req, res) => {
        try {
            const joinedRooms = await StudyRoom.find({ members: req.user._id });
            res.status(200).json(joinedRooms);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching joined rooms' });
        }
    });

    // Get all available study rooms (rooms the user hasn't joined)
    router.get('/available', authenticate, async (req, res) => {
        try {
            const availableRooms = await StudyRoom.find({ members: { $ne: req.user._id } });
            res.status(200).json(availableRooms);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching available rooms' });
        }
    });

    // Send message in a study room
    router.post('/:roomId/sendMessage', authenticate, async (req, res) => {
        const { roomId } = req.params;
        const { text } = req.body;

        // Validate text message
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message text cannot be empty' });
        }

        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Create the message object with the sender (user ID) and text
            const message = {
                sender: req.user._id,
                text,
                timestamp: new Date(),
            };

            // Add the message to the room in the database
            await StudyRoom.findByIdAndUpdate(roomId, { $push: { messages: message } });

            // Emit the message to all users in the room
            io.to(roomId).emit('newMessage', { ...message, roomId });

            // Optionally, return all messages in the room with sender populated (username)
            const updatedRoom = await StudyRoom.findById(roomId).populate('messages.sender', 'username');
            res.status(200).json(updatedRoom.messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error sending message' });
        }
    });

    // Get all messages in a room
    router.get('/:roomId/messages', authenticate, async (req, res) => {
        const { roomId } = req.params;
        try {
            const room = await StudyRoom.findById(roomId)
                .populate('messages.sender', 'username') // Populating sender's username
                .sort({ 'messages.timestamp': 1 }); // Sort messages by timestamp (oldest first)

            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            // Return the messages of the room with sender information
            res.status(200).json(room.messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching messages' });
        }
    });

    router.patch('/:roomId/edit-topic', authenticate, async (req, res) => {
        const { roomId } = req.params;
        const { topic } = req.body;

        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) return res.status(404).json({ error: 'Room not found' });

            // Only allow the creator to edit the topic
            if (room.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            room.topic = topic;
            await room.save();
            io.emit('topicUpdated', { roomId, topic });
            res.status(200).json({ message: 'Room topic updated successfully', room });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating room topic' });
        }
    });

    // Route to delete a study room
    router.delete('/:roomId', authenticate, async (req, res) => {
        const { roomId } = req.params;

        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) return res.status(404).json({ error: 'Room not found' });

            // Only allow the creator to delete the room
            if (room.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await StudyRoom.findByIdAndDelete(roomId);
            io.emit('roomDeleted', { roomId });
            res.status(200).json({ message: 'Room deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting room' });
        }
    });


    return router;
};
