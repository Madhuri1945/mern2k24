const express = require('express');
const router = express.Router();
const Message = require('../models/message');

const getChat = async (req, res) => {
    const { senderId, senderModel, receiverId, receiverModel } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, senderModel, receiver: receiverId, receiverModel },
                { sender: receiverId, senderModel: receiverModel, receiver: senderId, receiverModel: senderModel }
            ]
        }).sort({ timestamp: 1 });
        console.log(messages);
        res.json(messages);
    } 
    catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

module.exports = {
    getChat
}
