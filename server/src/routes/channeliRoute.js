const utils = require('../utils/channeliControllers');
const express = require('express');
const router = express.Router();

router.get('/user/login', utils.OAuthView);

router.get('/auth/callback', utils.OAuthCallback);

module.exports = router;