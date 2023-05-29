const express = require('express');

const {create_connection, get_followers, get_following} = require("../controllers/follower");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post('/follow-connection', authMiddleware, create_connection);

router.get('/followers', authMiddleware,  get_followers);

router.get('/following', authMiddleware, get_following);

module.exports = router;