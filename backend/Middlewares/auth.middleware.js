const jwt = require("jsonwebtoken");
const User= require('../Models/user.model.js');

const protectRoute= async(req,res,next)=>{

    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(201).json({
                data: null,
                msg: "no token , unauthorised",
            });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({
                msg: " Invalid token"
            });
        }
        // find the user using the id and select everything of user except the password .
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
             return res.status(404).json({
                msg: "User not found"
            });
        }

        req.user= user;
        next();
        
    }
    catch(err){
        console.log("Error in middleware auth",err);
        return res.status(400).json({msg: " Internal server error"});
    }
}

module.exports= protectRoute;