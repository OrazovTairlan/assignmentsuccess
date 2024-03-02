// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

// User Registration Route


router.post("/create-user", async (req, res) => {
    try {
        await UserModel.create({
            username: req.body.username,
            password: req.body.password,
            creationDate: new Date(),
            updateDate: new Date(),
            deletionDate: new Date(),
            role: "regular user"
        });
        res.json("User created successfully");
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;