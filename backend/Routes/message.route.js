

const express =require('express');

const router= express.Router();
const protectRoute = require("../Middlewares/auth.middleware.js");
const { getUsersForSidebar , sendMessage,getMessages} = require("../Controllers/message.controller.js");

// fetch all the users on the left side to get all the messages from the users
router.get('messages/users',protectRoute,getUsersForSidebar);

// when selected a user you need to show messages from both sides 
router.get('messages/:userId',protectRoute,getMessages);

router.post('messages/send/:userId',protectRoute,sendMessage);



module.exports= router;