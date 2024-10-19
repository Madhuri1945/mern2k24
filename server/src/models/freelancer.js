const mongoose = require('mongoose');
const { ConnectionRequest } = require('./connection');

const freelancerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "FREELANCER" },
    firstName: { type: String },
    lastName: { type: String },
    profileImage: { type: String, default: "" },
    hasProfile: { type: Boolean, default: false }, 
    bio: { type: String },
    skills: [{ type: String }],
    experience: [
        {
        jobTitle: { type: String },
        company: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String },
        },
    ],
    education: [
        {
        degree: { type: String },
        school: { type: String },
        graduationYear: { type: String },
        },
    ],
    freelancerConnections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' }],
    producerConnections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }],
    // connections: [
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }
    // ],
    connectionRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ConnectionRequest' }],
    connectionRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ConnectionRequest' }],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = {
    Freelancer, 
}