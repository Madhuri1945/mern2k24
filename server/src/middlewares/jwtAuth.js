const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;

const jwtAuthentication = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authorizationHeader.split(' ')[1];
    try{
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                req.user = user;
                // console.log(user)
                next();
            }
        });
    }
    catch{
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    jwtAuthentication
}