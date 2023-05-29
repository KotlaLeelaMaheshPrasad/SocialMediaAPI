const mongoose = require("mongoose");

const commentschema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: {
        type: String,
        required: true
    },
    commentedBy: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    }
    
}, {timestamps: true});

const comment = mongoose.model('comment', commentschema);

module.exports = comment;