const express = require('express');
const router = express.Router();
const Quiz = require('../models/QuizModel'); // Assuming the quiz model is defined in a file named 'quiz.js'

// Route to get the quiz questions
router.get('/quiz', async (req, res) => {
    try {
        const quiz = await Quiz.findOne({});
        res.render("quiz", {
            quizData: quiz.data
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Route to submit user answers for the quiz
router.get('/quiz/create', async (req, res) => {


    try {
        // Assuming the user is authenticated and their ID is available in req.user
        // Save the user answers to the database
        await Quiz.create(
            {
                data: {
                    "questions": [
                        {
                            "question": "What is the capital of Italy?",
                            "options": ["Rome", "Paris", "Berlin", "Madrid"],
                            "correctAnswer": "Rome"
                        },
                        {
                            "question": "What is the capital of Germany?",
                            "options": ["Berlin", "Paris", "Rome", "Madrid"],
                            "correctAnswer": "Berlin"
                        },
                        {
                            "question": "What is the capital of Australia?",
                            "options": ["Canberra", "Sydney", "Melbourne", "Brisbane"],
                            "correctAnswer": "Canberra"
                        },
                        {
                            "question": "What is the capital of Brazil?",
                            "options": ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
                            "correctAnswer": "Brasília"
                        }
                    ]
                }
            }
        );

        res.json({message: "Created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Route to submit user answers for the quiz
router.post('/quiz/submit', async (req, res) => {
    const {userAnswers} = req.body;
    if (!userAnswers || !Array.isArray(userAnswers)) {
        return res.status(400).json({message: 'Invalid user answers data'});
    }

    try {
        // Assuming the user is authenticated and their ID is available in req.user
        const userId = req.user.id;

        // Save the user answers to the database
        await Quiz.findOneAndUpdate(
            {'userAnswers.userId': userId},
            {$set: {'userAnswers.$.answers': userAnswers}},
            {upsert: true}
        );

        res.json({message: 'User answers submitted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;