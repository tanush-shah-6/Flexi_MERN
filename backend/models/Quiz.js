const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
    topic: String,
    question: String,
    options: [String],
    answer: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizQuestionSchema);
