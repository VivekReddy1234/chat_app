const express = require("express");

const router= express.Router();
const {signup , login,logout,updateProfile,checkAuth} = require('../Controllers/auth.controller.js');
const protectRoute = require("../Middlewares/auth.middleware.js");


router.post('/signup',signup);


router.post('/login',login);


router.post('/logout',logout);

router.put('/update-profile',protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth);


module.exports= router;