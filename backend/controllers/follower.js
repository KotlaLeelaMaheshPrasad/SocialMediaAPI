const mongoose = require('mongoose');

const follower = require('../models/follower');

const addFollower = async (connctionDetails) => {
    await follower.create(connctionDetails);
}

const create_connection = async (request, response) => {
    const {following} = request.body;
    const connectionDetails = {
        _id: new mongoose.Types.ObjectId(),
        follower: request.username,
        following: following
    };
    const result = await follower.find({follower: request.username, following: following});
    if(result.length===0){
    await addFollower(connectionDetails);
    response.send("follow-request successfull");
    }else{
        response.status(400).send("connection was already there");
    }
};

const get_followers = async (request, response) => {
    let result  = await follower.find({following : request.username});
    response.send(result);
};

const get_following = async (request, response) => {
    let result = await follower.find({follower: request.username});
    response.send(result);
};

module.exports = {create_connection, get_followers, get_following};