const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');
const authenticate = require('../middleware/authenticate');

module.exports = (io) => {
    router.post('/create', authenticate, async (req, res) => {
        const { name, topic } = req.body;
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

    router.post('/:roomId/join', authenticate, async (req, res) => {
        const { roomId } = req.params;
        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

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

    router.post('/:roomId/leave', authenticate, async (req, res) => {
        const { roomId } = req.params;
        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            room.members = room.members.filter(member => member.toString() !== req.user._id.toString());
            await room.save();

            io.to(roomId).emit('userLeft', { userId: req.user._id, roomId });

            res.status(200).json({ message: 'Left room successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error leaving room' });
        }
    });

    router.get('/joined', authenticate, async (req, res) => {
        try {
            const joinedRooms = await StudyRoom.find({ members: req.user._id });
            res.status(200).json(joinedRooms);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching joined rooms' });
        }
    });

    router.get('/available', authenticate, async (req, res) => {
        try {
            const availableRooms = await StudyRoom.find({ members: { $ne: req.user._id } });
            res.status(200).json(availableRooms);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching available rooms' });
        }
    });

    router.post('/:roomId/sendMessage', authenticate, async (req, res) => {
        const { roomId } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message text cannot be empty' });
        }

        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            const message = {
                sender: req.user._id,
                text,
                timestamp: new Date(),
            };

            await StudyRoom.findByIdAndUpdate(roomId, { $push: { messages: message } });

            io.to(roomId).emit('newMessage', { ...message, roomId });

            const updatedRoom = await StudyRoom.findById(roomId).populate('messages.sender', 'username');
            res.status(200).json(updatedRoom.messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error sending message' });
        }
    });

    router.get('/:roomId/messages', authenticate, async (req, res) => {
        const { roomId } = req.params;
        try {
            const room = await StudyRoom.findById(roomId)
                .populate('messages.sender', 'username') 
                .sort({ 'messages.timestamp': 1 }); 

            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

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

    router.delete('/:roomId', authenticate, async (req, res) => {
        const { roomId } = req.params;

        try {
            const room = await StudyRoom.findById(roomId);
            if (!room) return res.status(404).json({ error: 'Room not found' });

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
