const jwt = require('jsonwebtoken')
const User = require('../models/user.models')
require('dotenv').config()
const TaskMange =async(req,res,next)=>{
    try {
        const token = req.cookies["jwt-taskManager"]
        if(!token){
            res.status(401).json({success:false,message:"Unauthorized - No Token Provided"})
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET)
       
        if(!decode){
            res.status(401).json({success:false,message:"Unauthorized - Invalid Token"})
        }
        const user = await User.findById(decode.userID)
        if(!user){
            res.status(404).json({success:false,message:"User Not Found."})
        }
        req.user = user;
        next()
    } catch (error) {
        console.log("Error in TaskMange Middlewares", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

module.exports = TaskMange