const mongoose = require('mongoose');

const StudyRoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        messages: [{
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('StudyRoom', StudyRoomSchema);
