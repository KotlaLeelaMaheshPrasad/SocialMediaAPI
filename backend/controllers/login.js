const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv=require("dotenv");
const mongoose = require('mongoose');
dotenv.config();

const user = require('../models/user');


module.exports = async (request, response) => {
    const {username, password} = request.body;
    let result = await user.find({username: username});
    if(result.length===0){
        response.send("user not present");
    }
    else{
        const match = await bcrypt.compare(password, result[0].password);
        if(match){
            const token = jwt.sign({
                    username: username
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' });
            response.send(JSON.stringify({
                response: "user logged in successfully",
                token: token
            }));
        }else{
            response.send("incorrect password");
        }
    }
};