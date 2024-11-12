const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');
const authenticate = require('../middleware/authenticate');

module.exports = (io) => {
    // Create a new study room
    router.post('/create', authenticate, async (req, res) => {
        const { name, topic } = req.body;

        if (!name || !topic) {
            return res.status(400).json({ error: 'Room name and topic are required' });
        }

        try {
            const creator = req.user._id;

            const room = new StudyRoom({
                name,
                topic,
                members: [creator],
                createdBy: creator,
            });

            await room.save();

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

            if (!room) return res.status(404).json({ error: 'Room not found' });
            if (room.members.includes(req.user._id)) {
                return res.status(400).json({ error: 'Already a member of this room' });
            }

            room.members.push(req.user._id);
            await room.save();

            io.to(roomId).emit('userJoined', { userId: req.user._id, roomId });
            res.status(200).json(room);
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
            if (!room) return res.status(404).json({ error: 'Room not found' });

            room.members = room.members.filter(member => member.toString() !== req.user._id.toString());
            await room.save();

            io.to(roomId).emit('userLeft', { userId: req.user._id, roomId });
            res.status(200).json({ message: 'Left room successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error leaving room' });
        }
    });

    // Send message in a study room
    router.post('/:roomId/sendMessage', authenticate, async (req, res) => {
        const { roomId } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message text cannot be empty' });
        }

        try {
            const room = await StudyRoom.findById(roomId);

            if (!room) return res.status(404).json({ error: 'Room not found' });
            if (!room.members.includes(req.user._id)) {
                return res.status(403).json({ error: 'You must be a member of the room to send messages' });
            }

            const message = {
                sender: req.user._id,
                text,
                timestamp: new Date(),
            };

            room.messages.push(message);
            await room.save();

            io.to(roomId).emit('newMessage', { ...message, roomId });
            res.status(200).json(message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error sending message' });
        }
    });

    // Get all messages in a room
    router.get('/:roomId/messages', authenticate, async (req, res) => {
        const { roomId } = req.params;

        try {
            const room = await StudyRoom.findById(roomId).populate('messages.sender', 'username');
            if (!room) return res.status(404).json({ error: 'Room not found' });

            if (!room.members.includes(req.user._id)) {
                return res.status(403).json({ error: 'You must be a member of the room to view messages' });
            }

            res.status(200).json(room.messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching messages' });
        }
    });

    // Delete a study room
    router.delete('/:roomId', authenticate, async (req, res) => {
        const { roomId } = req.params;

        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) return res.status(404).json({ error: 'Room not found' });

            if (room.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'You are not authorized to delete this room' });
            }

            await room.remove();
            io.emit('roomDeleted', { roomId });
            res.status(200).json({ message: 'Room deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting room' });
        }
    });

    // Edit the topic of a study room
    router.patch('/:roomId/edit-topic', authenticate, async (req, res) => {
        const { roomId } = req.params;
        const { topic } = req.body;

        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) return res.status(404).json({ error: 'Room not found' });

            if (room.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'You are not authorized to edit this room' });
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

    return router;
};
