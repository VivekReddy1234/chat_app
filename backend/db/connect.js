const mongoose = require("mongoose");
const dotenv= require("dotenv");

dotenv.config();

const url = process.env.MONGO_URL;

const connnectDb= async()=>{
   await  mongoose.connect(url).then(()=>{
    console.log("DataBase Connected Successfully");
}).catch((err)=>{
    console.log("Error",err);
});

}

module.exports=connnectDb;