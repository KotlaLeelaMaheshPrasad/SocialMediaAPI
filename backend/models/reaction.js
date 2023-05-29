const mongoose = require("mongoose");

const reactionschema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reaction: {
        type: String,
        required: true
    },
    reactedBy: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    }
    
}, {timestamps: true});

const reaction = mongoose.model('reactions', reactionschema);

module.exports = reaction;