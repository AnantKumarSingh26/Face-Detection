const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: [true, "Token must be unique"]
    }
}, {
    timestamps: true
})

const blacklistModel = mongoose.model("Blacklist", blacklistSchema, "blacklist");
module.exports = blacklistModel;