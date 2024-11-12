const mongoose = require('mongoose');

// Define Message Schema
const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    text: { type: String, required: true, minlength: 1 }, // Ensure text is non-empty
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true } // Automatically create `createdAt` and `updatedAt` fields
);

// Define StudyRoom Schema
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
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [messageSchema], // Embedding the message schema here
  },
  { timestamps: true } // Automatically create `createdAt` and `updatedAt` fields for the room
);

module.exports = mongoose.model('StudyRoom', StudyRoomSchema);
