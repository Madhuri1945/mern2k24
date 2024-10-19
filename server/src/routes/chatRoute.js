const express = require('express');
const router = express.Router();
const ChatControllers = require('../utils/ChatControllers');
const jwtAuth = require('../middlewares/jwtAuth');

router.get('/:senderId/:senderRole/:receiverId/:receiverRole', jwtAuth.jwtAuthentication, ChatControllers.getChat);
module.exports = router;