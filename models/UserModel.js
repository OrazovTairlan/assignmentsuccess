const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    role: String,
    password: String,
    creationDate: Date,
    updateDate: Date,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel