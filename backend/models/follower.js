const mongoose = require("mongoose");

const followerschema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    follower: {
        type: String,
        required: true
    },
    following: {
        type: String,
        required: true
    }
    
}, {timestamps: true});

const follower = mongoose.model('follower', followerschema);

module.exports = follower;