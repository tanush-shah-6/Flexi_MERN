const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    topic: String,
    question: String,
    answer: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
