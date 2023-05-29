const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: [true, 'usename is requires'],
        unique: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is requires']
    }
}, {timestamps: true});

const user = mongoose.model('users', userschema);

module.exports = user;

