const { Freelancer } = require('../models/freelancer')
const { Producer } = require('../models/producer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
// const { use } = require('../routes/authRoute');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;

const signup = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (role === 'FREELANCER') {
        const freelancer = await Freelancer.findOne({ $or: [{ username }, { email }] });
        console.log(req.body);
        if (freelancer) {
            console.log("I reached here")
            res.status(400).json({ message: "Username Or Email already in use" });
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10);
            const newFreelancer = new Freelancer({
                username,
                password: hashPassword,
                email,
                role
            });
            await newFreelancer.save();
            const token = jwt.sign({ freelancerId: newFreelancer.id, username, role: newFreelancer.role }, secretKey, { expiresIn: '1h' });
            res.status(201).json({ message: "User Account created successfully", role: role, token: token });
        }
    }

    else if (role === 'PRODUCER') {
        const producer = await Producer.findOne({ $or: [{ username }, { email }] });
        console.log(req.body);
        if (producer) {
            res.status(400).json({ message: "Username Or Email already in use" });
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10);
            const newProducer = new Producer({
            username,
            password: hashPassword,
            email,
            role
            })
            await newProducer.save();
            const token = jwt.sign({ producerId: newProducer.id, username, role: newProducer.role }, secretKey, { expiresIn: '1h' });
            res.status(201).json({ message: "User Account created successfully", role: role, token: token });
        }
    }

    else {
        res.status(400).json({ message: "Role is required" });
    }
}

const freelancerLogin = async (req, res) => {
    const { username, password } = req.body;
    const freelancer = await Freelancer.findOne({ username });
    if (!freelancer) {
        res.status(404).json({ message: "Incorrect Credentials" });
    }
    else {
        const isPasswordValid = await bcrypt.compare(password, freelancer.password);
        if (isPasswordValid) {
            // console.log(secretKey);
            const token = jwt.sign({ username, role: freelancer.role }, secretKey, { expiresIn: '1h' });
            res.json({ message: 'Authenticated Freelancer', token });
        }
    }
}

const producerLogin = async (req, res) => {
    const { username, password } = req.body;
    const producer = await Producer.findOne({ username });
    if (!producer) {
        res.status(404).json({ message: "Incorrect Credentials" });
    }
    else {
        const isPasswordValid = await bcrypt.compare(password, producer.password);
        if (isPasswordValid) {
            // console.log(secretKey);
            const token = jwt.sign({ username, role: producer.role }, secretKey, { expiresIn: '1h' });
            res.json({ message: 'Authenticated Freelancer', token });
        }
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.body);
    const freelancer = await Freelancer.findOne({ username });;
    if (!freelancer) {
        const producer = await Producer.findOne({ username });
        if (!producer) {
            res.status(404).json({ message: "Producer not found" });
        }
        else{
            const isPasswordValid = await bcrypt.compare(password, producer.password);
            if (isPasswordValid) {
                // console.log(secretKey);
                const token = jwt.sign({ username, role: producer.role }, secretKey, { expiresIn: '1h' });
                res.json({ message: 'Authenticated', token });
            } 
            else {
                res.status(401).json({ message: 'Invalid credentials' });
            }   
        }
    }
    else{
        const isPasswordValid = await bcrypt.compare(password, freelancer.password);
        if (isPasswordValid) {
            // console.log(secretKey);
            const token = jwt.sign({ username, role: freelancer.role }, secretKey, { expiresIn: '1h' });
            res.json({ message: 'Authenticated', token });
        } 
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }   
    }
}

const userDetails = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secretKey, { complete: true }); 
        // console.log("Success? ")
        const userRole = decoded.payload.role;
        // console.log(decoded)
        // console.log(userRole)
        if (userRole === 'FREELANCER') {
            const freelancer = await Freelancer.findOne({ username: decoded.payload.username });
            if (!freelancer) {
                res.status(401).json({ message: "Unauthorized" });
            }
            else {
                res.json({ user: freelancer, decodedToken: decoded });
            }
        }
        else if (userRole === 'PRODUCER') {
            const producer = await Producer.findOne({ username: decoded.payload.username });
            if (!producer) {
                res.status(401).json({ message: "Unauthorized" });
            }
            else {
                res.json({ user: producer, decodedToken: decoded });
            }
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } 
    catch (error) {
        // console.log("Reached here")
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = {
    signup,
    freelancerLogin,
    producerLogin,
    // login,
    userDetails
}