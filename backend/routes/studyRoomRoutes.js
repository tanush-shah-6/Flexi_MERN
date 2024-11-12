const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');
const authenticate = require('../middleware/authenticate');

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
    try {
        const message = {
            sender: req.user._id,
            text,
            timestamp: new Date(),
        };

        await StudyRoom.findByIdAndUpdate(roomId, { $push: { messages: message } });
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending message' });
    }
});

module.exports = router;
