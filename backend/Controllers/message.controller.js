const cloudinary=  require("../Utils/cloudinary.js");
const  Message = require('../Models/message.model.js');
const User = require("../Models/user.model.js");
const { getReceiverSocketId } = require("../Utils/socket.js");
const {io} = require("../Utils/socket.js");

const getUsersForSidebar= async(req,res)=>{
    try {
        const loggedInUserId= req.user._id;
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId}}).select("-password");
        
        res.status(200).json(filteredUsers);
    } catch (error) {
        
        console.log("Error in message controller",error);
        res.status(500).json({error:"Internal Server Error"});
    }
} 
const getMessages= async(req,res)=>{
    try{
   const {id} = req.params;
   const sender = req.user._id;

   const messages  = await Message.find({
    $or:[
        {senderId:sender, receiverId:id},
        {senderId:id , receiverId:sender}
    ]
   });
  res.status(200).json(messages);
 }
 catch(error){
    console.log("Error in message controller",error);
    res.status(500).json({msg: " Internal server eerror"}); 
 }

}
const sendMessage  = async(req,res)=>{
    try {

        const {text,image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);

            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
        
    } catch (error) {
        console.log("Error in message controller",error);
    }
}

module.exports = {
    getUsersForSidebar,
    getMessages,
    sendMessage,
}