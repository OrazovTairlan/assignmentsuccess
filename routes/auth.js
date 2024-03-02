// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

// User Registration Route


router.post("/auth", async function (req, res) {
    try {
        console.log("hereee")
        const foundItems = await UserModel.find({
            username: req.body.name,
            password: req.body.password
        });

        if (foundItems.length > 0) {
            const founded = foundItems[0]
            res.json(founded);
        } else {
            res.json("error");
        }
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
});
router.post("/register", async (req, res) => {
    try {


        const foundedUser = await UserModel.find({
            username: req.body.username,
            password: req.body.password
        }).lean()
        if (foundedUser.length > 0) {
            res.json("error")
            return;
        }
        const value = await UserModel.create({
            username: req.body.username,
            password: req.body.password,
            creationDate: new Date(),
            updateDate: new Date(),
            isAdmin: false
        });
        res.json(value)
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;