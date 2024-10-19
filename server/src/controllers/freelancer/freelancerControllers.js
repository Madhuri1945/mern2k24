const { Freelancer } = require('../../models/freelancer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const { Job } = require('../../models/job');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;

// const freelancerDetails = async (req, res) => {
//     const token = req.headers.authorization.split(' ')[1]; 
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     const decoded = jwt.verify(token, secretKey, { complete: true }); 
//     const freelancer = await Freelancer.findOne({ username: decoded.payload.username });
//     if (!freelancer) {
//         res.status(401).json({ message: "Unauthorized" });
//     }
//     else {
//         res.json({ user: decoded });
//     }
// }



// Freelancer Profile Controllers
const getFreelancerProfileInfo = async (req, res) => {
    try {
        // if (req.user.role !== 'FREELANCER') {
        //     return res.status(401).json({ message: 'Only Freelancer allowed to access' });
        // }
        const freelancer = await Freelancer.findOne({ username: req.user.username });
        const { password, ...profileInfo } = freelancer._doc; // important use ._doc to get the actual collection fields, otherwise we get some gibberish
        return res.status(200).json(profileInfo);
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateFreelancerProfileInfo = async (req, res) => {
    try {
        // if (req.user.role !== 'FREELANCER') {
        //     return res.status(401).json({ message: 'Only Freelancers allowed to access' });
        // }
        const freelancer = await Freelancer.findOne({ username: req.user.username });
        const updateFields = { ...req.body };
        console.log(freelancer);
        console.log(updateFields);
        const result = await Freelancer.findOneAndUpdate(
            { _id: freelancer._id },
            { $set: updateFields },
            { new: true }
        );
        console.log(result);
        res.status(200).json({ updatedProfile: result, message: "Profile Updated Successfully"});
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Job Controllers for Freelancer
const getJobPostsFreelancer = async (req, res) => {
    try {
        // console.log('hello');
        // console.log(req.user);
        // if (req.user.role !== 'FREELANCER') {
        //     return res.status(401).json({ message: 'Only Freelancers allowed to access' });
        // }
        // console.log('hello');
        const jobPosts = await Job.find({}).populate('producer');
        // console.log(jobPosts)
        res.json(jobPosts);
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching job posts" })
    } 
}


// Job Apply Controllers for Freelancers
const checkIfApplied = async (req, res) => {
    try {
        if (req.user.role !== 'FREELANCER') {
            return res.status(401).json({ message: 'Only Freelancers can apply' });
        }
        const jobId = req.params.jobId;
        const freelancer = await Freelancer.findOne({ username: req.user.username });
        const jobToCheckIfApplied = await Job.findOne({ _id: jobId });

        const applied = jobToCheckIfApplied.applicants.includes(freelancer._id);
        if (applied) {
            return res.json({ message: "User has already applied for this job", applied: applied });
        } 
        return res.json({ message: "User has not applied for this job", applied: applied });
    }
    catch (error) {
        res.status(500).json({ message: "Error in checking applicant for the job post" });
    }
}

const applyJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'FREELANCER') {
            return res.status(401).json({ message: 'Only Freelancers can apply' });
        }
        const jobId = req.params.jobId
        const freelancer = await Freelancer.findOne({ username: req.user.username });
        const jobToApply = await Job.findOne({ _id: jobId });

        const alreadyApplied = jobToApply.applicants.includes(freelancer._id);
        if (alreadyApplied) {
            return res.json({ message: "User has already applied for this job" });
        }

        jobToApply.applicants.push(freelancer._id);
        console.log(jobToApply.applicants);
        freelancer.appliedJobs.push(jobId);
        console.log(freelancer.appliedJobs);

        await jobToApply.save();
        await freelancer.save();

        return res.json({ message: "Successfully applied for the job" })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in applying to job post" });
    }
}

const unapplyToJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'FREELANCER') {
            return res.status(401).json({ message: 'Only Freelancers can apply' });
        }
        const jobId = req.params.jobId
        const freelancer = await Freelancer.findOne({ username: req.user.username });
        const jobToUnapply = await Job.findOne({ _id: jobId });

        const freelancerIdString = freelancer._id.toString();
        jobToUnapply.applicants = jobToUnapply.applicants.filter(
            applicantId => applicantId.toString() !== freelancerIdString
        );
        freelancer.appliedJobs = freelancer.appliedJobs.filter(
            appliedJobId => appliedJobId.toString() !== jobId
        );

        console.log(freelancer.appliedJobs);
        console.log(jobToUnapply.applicants);

        await jobToUnapply.save();
        await freelancer.save();

        return res.json({ message: "Successfully unapplied for the job" })
    }
    catch (error) {
        res.status(500).json({ message: "Error in unapplying to job post" });
    }
}

const getAppliedJobPosts = async (req, res) => {
    try {
        if (req.user.role !== 'FREELANCER') {
            return res.status(401).json({ message: 'Only Freelancers can apply' });
        }
        // console.log("hello")
        const freelancer = await Freelancer.findOne({ username: req.user.username }).populate('appliedJobs');
        // console.log(freelancer.appliedJobs);
        res.json(freelancer.appliedJobs);
    }
    catch (error) {
        // console.error(error)
        res.status(500).json({ message: "Error Getting the job posts" });
    }
}

module.exports = {
    // freelancerDetails
    getFreelancerProfileInfo,
    updateFreelancerProfileInfo,
    getJobPostsFreelancer,
    checkIfApplied,
    applyJobPost,
    unapplyToJobPost,
    getAppliedJobPosts,
}