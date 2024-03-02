// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const translate = require("../models/translate")
const UserModel = require('../models/UserModel');
const active = "ru"

// User Registration Route


// Admin Delete Route
router.delete("/admin", async function (req, res) {
    try {
        await UserModel.deleteOne({_id: req.body.id});
        res.json("User deleted successfully");
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).send('Internal Server Error');
    }
});
router.put("/admin", async function (req, res) {
    try {
        await UserModel.updateOne(
            {_id: req.body.id},
            {username: req.body.username, password: req.body.password, isAdmin: req.body.isAdmin}
        );

        const result = await UserModel.find({}).lean();
        res.render("admin", {users: result, translate: translate[active]});
    } catch (err) {
        console.error('Error updating admin:', err);
        res.status(500).send('Internal Server Error');
    }
});
// Admin Route
router.get("/admin", async function (req, res) {
    try {
        const allUsers = await UserModel.find({}).lean()
        res.render("admin", {users: allUsers, translate: translate[active]});
    } catch (err) {
        console.error('Error reading users:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;