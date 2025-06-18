const dotenv= require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");


const generateToken= (userId,res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });

    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "Strict",
        secure: false,  /// true only when in production 
    })
    
}

module.exports = generateToken;