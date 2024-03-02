// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const translate = require("../models/translate")
const UserModel = require('../models/UserModel');
const ItemModel = require('../models/ItemModel');
const active = "ru"

// User Registration Route


// Admin Delete Route
router.delete("/delete-item", async function (req, res) {
    try {
        await ItemModel.deleteOne({_id: req.body.id});
        res.json("User deleted successfully");
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).send('Internal Server Error');
    }
});


router.post("/create-item", async function (req, res) {
    console.log(req.body)
    try {
        await ItemModel.create({
            ...req.body,
            name: {
                kz: req.body.kazakhName,
                en: req.body.englishName
            },
            description: {
                kz: req.body.kazakhDescription,
                en: req.body.descriptionEn
            }
        });
        res.json("User deleted successfully");
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).send('Internal Server Error');
    }
});
router.put("/update-item", async function (req, res) {
    try {
        await ItemModel.updateOne(
            {_id: req.body.id},
            {
                name: {
                    kz: req.body.kazakhName,
                    en: req.body.englishName
                },




















                description: {
                    kz: req.body.kazakhDescription,
                    en: req.body.englishDescription,
                },
                imageFirst: req.body.imageFirst,
                imageSecond: req.body.imageSecond,
                imageThree: req.body.imageThree,
                updatedAt: new Date()
            }
        );

        const result = await ItemModel.find({}).lean();
        res.json("success")
    } catch (err) {
        console.error('Error updating admin:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;