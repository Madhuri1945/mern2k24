const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const { Freelancer } = require('../models/freelancer')
const { Producer } = require('../models/producer');
// const { use } = require('../routes/authRoute');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;
const details = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, secretKey, { complete: true }); 
        return res.json({ user: decoded })    
    }
    catch (error) {
        return res.status(400).json({ message: "Error decoding the token" });
    }
}

const profileOwnerDetails = async (req, res) => {
    try {
        const { role, username } = req.params;
        // console.log(role, username);
        // console.log("hello");

        const userModel = role === 'FREELANCER' ? Freelancer : Producer;
        // console.log(userModel);

        // console.log("I reached here");
        const profileOwner = await userModel.findOne({ username })
        // console.log(profileOwner);
        if (userModel === Freelancer) {
            // console.log("Reached if block")
            await profileOwner
                .populate([
                    { path: 'appliedJobs' },
                    { path: 'freelancerConnections' },
                    { path: 'producerConnections' },
                    { path: 'connectionRequestsSent' },
                    { path: 'connectionRequestsReceived' },
                ]);
        }
        else if (userModel === Producer) {
            // console.log("Reached else if block")
            await profileOwner
                .populate([
                    { path: 'jobsCreated' },
                    { path: 'freelancerConnections' },
                    { path: 'producerConnections' },
                    { path: 'connectionRequestsSent' },
                    { path: 'connectionRequestsReceived' },
                ]);
        }

        // console.log(profileOwner);

        if (!profileOwner) {
            return res.status(404).json({ message: "User with such username and role does not exist" });
        }
        return res.json(profileOwner);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    details,
    profileOwnerDetails
}