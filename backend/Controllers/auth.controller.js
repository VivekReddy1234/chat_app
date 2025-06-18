const User = require("../Models/user.model.js");
const bcrypt= require("bcryptjs");
const generateToken = require("../Utils/util.js");
const cloudinary = require("../Utils/cloudinary.js");

const signup= async (req,res)=>{
    try {
        const { fullName, email, password } = req.body;
    
        if (!fullName || !email || !password) {
          return res.status(400).json({ msg: "Please fill all fields" });
        } 
   
    const user = await User.findOne({email});

    if(user) return res.status(400).json({msg: "Email already exists"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);

    const newUser= await User.create({
        fullName: fullName,
        email: email,
        password : hashedPassword,
    })

    if(newUser){
        // generate token for it 
        generateToken(newUser._id,res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    }
    else{
        res.status(400).json({msg: " Invalid User Data"});
    }

 }
 catch(error){
    console.log(error);
 }

}


const login = async(req,res)=>{
   try{
    const {email, password} = req.body;
    const user = await User.findOne({email});
     
    if(!user) return res.status(400).json({msg: " No User Found "});

    // found the user now match the password 
   const isPasswordCorrect=  await bcrypt.compare(password,user.password);
     if(!isPasswordCorrect){
        return res.status(400).json({msg:"Invalid Credentials"});
     }  

     generateToken(user._id,res);
     res.status(200).json({
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        profilePic: user.profilePic,
     });

   }
catch(error){
    console.log(error);
    res.status(500).json({msg: " Internal Server Error"});
}
};

const logout = (req,res)=>{

    try{
        res.cookie('jwt',"",{maxAge:0});
        res.status(200).json({msg: " Logout Successfull"});

    }
    catch(error){
    console.log("Error in logout controller",error);
    res.status(500).json({
        msg: " Internal Server Error"
    });
    }
     
}

const updateProfile=async(req,res)=>{
  try {
    const { profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
        console.log("there is no profile pic in the request");
        return res.status(400).json({msg: " No profile Pic"});

    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new: true});
        console.log(updatedUser);
   res.status(200).json(updatedUser);
    
  } catch (error) {
     console.log("Error in cloudinary upload",error);
     res.status(500).json({msg:" Internal server error"});
  }
}


const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
        
    } catch (error) {
        console.log("Error in checkAuth controller",error);
        res.status(500).json({msg: " Internal Server Error"});
    }
}


module.exports= {
    signup,
    login,
    logout,
    updateProfile,
    checkAuth
}