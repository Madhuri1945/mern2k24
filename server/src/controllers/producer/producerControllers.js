const { Job } = require('../../models/job');
const { Producer } = require('../../models/producer');

// SIMPLE CRUD BABYYYYYYYYYY, TODO - Check these routes on POSTMAN + Do Things related to profile building and updating profile => Both Producer and Freelancer
// LETS START BY CREATING YOUR PROFILE => This thing, Most probably will be taken care of in the frontend

// ---------------------------- JOB POST CONTROLLERS -----------------------------

const createJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            return res.status(401).json({ message: 'Only producers are allowed to create jobs' });
        }
        // Need to do this since req.user._id is not any field, either then i need to sign the jwt with the id
        const producer = await Producer.findOne({ username: req.user.username });
        const job = new Job({
            ...req.body,
            producer: producer._id,
        });
        await job.save();
        
        producer.jobsCreated.push(job._id);
        await producer.save();

        return res.status(200).json({ message: 'Job created successfully', job });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Retrieve all post for a specific producer (route designed for a producer's frontend)
// For a freelancer this will be different, he will see posts by all the producers, or those in his connection

const getAllJobPosts = async (req, res) => {
    try {
        const producer = await Producer.findOne({ username: req.user.username });
        console.log(producer)
        const jobs = await Job.find({ producer: producer._id }).populate('applicants');
        return res.status(200).json(jobs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
        }
        const jobId = req.params.jobId;
        const updateFields = { ...req.body };
        const result = await Job.findOneAndUpdate(
            { _id: jobId },
            { $set: updateFields },
            { new: true }
        );
        res.status(200).json({ result , message: 'Job Updated Successfully'});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
        }
        const jobId = req.params.jobId;
        const deletedJob = await Job.findOneAndDelete({ _id: jobId });
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job Successfully Deleted', deletedJob });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getDetailedJobPost = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findOne({ _id: jobId }).populate('producer');
        const producer = await Producer.findOne({ _id: job.producer });
        return res.status(200).json({ job, producer});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// ---------------------------- PROFILE CONTROLLERS -----------------------------

const getProducerProfileInfo = async (req, res) => {
    try {
        // if (req.user.role !== 'PRODUCER') {
        //     return res.status(401).json({ message: 'Only Producers allowed to access' });
        // }
        const producer = await Producer.findOne({ username: req.user.username });
        const { password, ...profileInfo } = producer._doc; // important use doc type to get the actual collection fields, otherwise we get some gibberish
        return res.status(200).json(profileInfo);
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// We can use this route to create profile as well
const updateProducerProfileInfo = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            return res.status(401).json({ message: 'Only Producers allowed to access' });
        }
        const producer = await Producer.findOne({ username: req.user.username });
        const updateFields = { ...req.body };
        console.log(producer);
        console.log(updateFields);
        const result = await Producer.findOneAndUpdate(
            { _id: producer._id },
            { $set: updateFields },
            { new: true }
        );
        console.log(result);
        res.status(200).json({ updatedProfile: result , message: 'Profile Updated Successfully'});
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// const getProfileInfoUsingUsername = async (req, res) => {
//     try {
//         const { username } = req.params;
//         const producer = await Producer.findOne({ username });
        
//     }
//     catch (error) {
//         res.status(500).json({ message: "Internal Server Error" })
//     }
// }


module.exports = {
    createJobPost,
    getAllJobPosts,
    updateJobPost,
    deleteJobPost,
    getDetailedJobPost,
    getProducerProfileInfo,
    updateProducerProfileInfo
}