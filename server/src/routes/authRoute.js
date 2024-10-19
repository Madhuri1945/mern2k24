const express = require("express");
const router = express.Router();
const utils = require("../utils/details");

router.get("/details", utils.details);

router.get("/profile-owner-details/:role/:username", utils.profileOwnerDetails);

// router.post("/signup", authController.signup);
// // router.post('/login', authController.login);
// router.post('/freelancer-login', authController.freelancerLogin);
// router.post('/producer-login', authController.producerLogin);
// router.get('/user-details', authController.userDetails)

module.exports = router;
