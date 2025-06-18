const express = require("express");
const dotenv= require("dotenv");
const path =require("path"); 

const {app,server} = require("../Utils/socket.js"); 
const authRouter = require("../Routes/auth.route");
const messageRouter= require("../Routes/message.route.js");
const connectDb= require("../db/connect.js");
const cookieParser= require("cookie-parser");
const cors = require("cors");


dotenv.config();

// const __dirname = path.resolve();
const PORT = process.env.PORT;

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ extended: true , limit: "10mb" }));

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


app.use('/api/auth',authRouter);
app.use('/api/messages',messageRouter);  

 if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/frontend/dist")));

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/frontend/dist/index.html"));
    })
 }

app.get('/',(req,res)=>{
    console.log("helloo");
    res.end("YOu are Welcome");
})
server.listen(PORT,()=>{
    console.log("Server Started Successfully");
    connectDb();
})