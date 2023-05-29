const mongoose = require("mongoose");

const postschema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
    
}, {timestamps: true});

const post = mongoose.model('post', postschema);

module.exports = post;