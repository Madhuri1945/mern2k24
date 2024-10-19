const { Freelancer } = require('../models/freelancer');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const redirectURI = process.env.redirect_uri;

// Less go 
const OAuthView = (req, res) => {
    const state = "success";
    const url = `https://channeli.in/oauth/authorise/?client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`
    res.redirect(url);
}

const OAuthCallback = async (req, res) => {
    console.log("hello");
    const authorizationCode = req.header('code');
    console.log(code);
    const tokenURL = "https://channeli.in/open_auth/token/";
    const data = { 
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectURI,
        code: authorizationCode,
    }
    const response_1 = await fetch(tokenURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            ...data
        }
    })
    response_1 = await response_1.json();
    console.log(response_1);

    const accessToken = response_1['access_token'];
    const refreshToken = response_1['refresh_token'];
    const userDataURL = 'https://channeli.in/open_auth/get_user_data/'
    
    const response_2 = await fetch(userDataURL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
    response_2 = await response_2.json();
    console.log(response_2);

    if (response_2.status === 200) {

    }
}

module.exports = {
    OAuthView,
    OAuthCallback
}