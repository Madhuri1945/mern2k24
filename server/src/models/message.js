const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    senderRole: {
        type: String,
        required: true,
        enum: ['FREELANCER', 'PRODUCER']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    },
    receiverRole: {
        type: String,
        required: true,
        enum: ['FREELANCER', 'PRODUCER']
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
