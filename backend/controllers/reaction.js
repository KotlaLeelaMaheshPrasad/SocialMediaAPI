const mongoose = require('mongoose');


const comment = require('../models/comment');

const reaction = require('../models/reaction');


const addReaction = async (reactionDetails) => {
    await reaction.create(reactionDetails);
}

const addComment = async (commentDetails) => {
    await comment.create(commentDetails);
}

const create_reaction = async(request, response) => {
    //create a reaction to the post
    const {postId} = request.params;
    const {reaction} = request.body;
    const reactionDetails = {
        _id: new mongoose.Types.ObjectId(),
        reactedBy: request.username,
        reaction: reaction,
        post_id: postId
    }
    await addReaction(reactionDetails);
    response.send("reaction posted");
};

const get_reactions = async(request, response) => {
    //get all the people with their corresponding reactions for the post
    const {postId} = request.params;
    let result = await reaction.find({post_id: postId});
    response.send(result);
};

const create_reply = async(request, response) => {
    //create a reply to the post
    const {postId} = request.params;
    const {comment} = request.body;
    const commentDetails = {
        _id: new mongoose.Types.ObjectId(),
        commentedBy: request.username,
        content: comment,
        post_id: postId
    }
    await addComment(commentDetails);
    response.send("comment has been added");
};

const get_replies = async(request, response) => {
    //get all the people with their corresponding replies for the post
    const {postId} = request.params;
    let result = await comment.find({post_id: postId});
    response.send(result);
};

module.exports = {get_reactions, get_replies, create_reply, create_reaction};