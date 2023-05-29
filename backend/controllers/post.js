const mongoose = require('mongoose');


const follower = require('../models/follower.js');

const post = require('../models/post.js');

const createPost = async (postDetails) => {
    await post.create(postDetails);
}

const create_post = async(request, response) => {
    //create a post
    const {content} = request.body;
    postDetails = {
        _id: new mongoose.Types.ObjectId(),
        content: content,
        createdBy: request.username
    }
    await createPost(postDetails);
    response.send("post created");
}

const get_particular_post = async(request, response) => {
    const {postId} = request.params;
    let result = await post.findById(postId);
    response.send(result);
}

const get_latest_posts = async(request, response)=> {
    //get all latest posts
    let followingList = await follower.find({follower: request.username});
    followingList = followingList.map((document) => {
        return document.following;
    })
    let result = await post.find({createdBy: {$in : followingList}}).sort({date: -1}).limit(10);
    response.send(result);
}

const get_all_posts = async(request, response) => {
    let result = await post.find({createdBy: request.username});
    //result = await result.toArray();
    //get all user posts
    response.send(result);
}

module.exports = {create_post, get_latest_posts, get_all_posts, get_particular_post};




