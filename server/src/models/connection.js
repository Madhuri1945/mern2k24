const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderType',
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverType',
    },
    senderType: {
        type: String,
        required: true,
        enum: ['Freelancer', 'Producer'], 
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['Freelancer', 'Producer'], 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = {
    ConnectionRequest
}
