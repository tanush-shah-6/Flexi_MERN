const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    text: { type: String, required: true, minlength: 1 }, 
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true } 
);

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
    messages: [messageSchema], 
  },
  { timestamps: true } 
);

module.exports = mongoose.model('StudyRoom', StudyRoomSchema);
