const mongoose = require('mongoose');

// Define the schema for a single user answer
const userAnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selectedOption: {
        type: String,
        required: true
    }
});

// Define the schema for a single quiz question
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    }
});

// Define the schema for the quiz containing an array of questions and user answers
const quizSchema = new mongoose.Schema({
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

// Create a Mongoose model for the quiz schema
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;