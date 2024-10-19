const mongoose = require('mongoose');
// const { ConnectionRequest } = require('./connection');

const producerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "PRODUCER" },
    hasProfile: { type: Boolean, default: false },
    profilePicture: {type: String, default: ""},
    companyName: { type: String, default: '' },
    industry: { type: String, default: '' },
    about: { type: String, default: '' },
    jobsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    freelancerConnections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' }],
    producerConnections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }],
    // connections: [
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }
    // ],
    connectionRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ConnectionRequest' }],
    connectionRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ConnectionRequest' }],
});

const Producer = mongoose.model('Producer', producerSchema);

module.exports = {
    Producer
}