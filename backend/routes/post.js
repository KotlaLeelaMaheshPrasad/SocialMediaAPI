const express = require('express');

const {create_post, get_latest_posts, get_all_posts, get_particular_post} = require('../controllers/post');

const {get_reactions, get_replies, create_reply, create_reaction} = require("../controllers/reaction");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get('/', authMiddleware, get_all_posts);

router.get('/feed', authMiddleware, get_latest_posts);

router.post('/', authMiddleware, create_post);

router.get('/:postId', authMiddleware, get_particular_post);

router.post('/:postId/reactions', authMiddleware, create_reaction);

router.get('/:postId/reactions', authMiddleware, get_reactions);

router.post('/:postId/replies', authMiddleware, create_reply);

router.get('/:postId/replies', authMiddleware, get_replies);

module.exports = router;