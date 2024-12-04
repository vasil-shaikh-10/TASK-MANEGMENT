const nodemailer = require('nodemailer')
const User = require("../../models/user.models");
const generateTokenAndCookieSet = require("../../utils/generateTokent");
 const bcrypt = require('bcrypt')
require('dotenv').config()
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAILUSER,
        pass:process.env.EMAILPASS
    }
})
let otp=Math.floor(100000 + Math.random() * 900000);

const register = async(req,res)=>{
    try {
        const {email,password,username,image,role,...otherFields}= req.body
        if(!email || !password || !username){
            return res.status(400).json({success:false,message:"All Fields Are Required"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({success:false,message:"Invalid Email"})
        }

        if(password.length < 6 ){
            return res.status(400).json({success:false,message:"Password must be at least 6 characters"})
        }

        if(Object.keys(otherFields).length > 0){
            res.status(404).send({msg:'Not Require.',invalidFields:Object.keys(otherFields)})
        }

        const existingUserByEmail = await User.findOne({email:email})
        if (existingUserByEmail){
            return res.status(400).json({success:false,message:"Email already exists"})
        }
        const newUser = new User ({
            email,
            password,
            username,
            image,
            role
        })
        generateTokenAndCookieSet(newUser._id,res)
        await newUser.save();
        res.status(201).json({success:true,user:{
            ...newUser._doc,
            password:""
        }})

    } catch (error) {
        console.log("Error in register controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
};

const login = async(req,res)=>{
    try {
        const {email,password,...otherFields}= req.body
        if(!email || !password){
            return res.status(400).json({success:false,message:"All Fields Are Required"})
        }

        if(Object.keys(otherFields).length > 0){
            res.status(404).send({msg:'Not Require.',invalidFields:Object.keys(otherFields)})
        }

        const existingUserByEmail = await User.findOne({email:email})
        let UserEmail = await User.findOne({email:email})

        if(UserEmail == null){
            res.status(201).send({success:false,message:'Email Not Match..'});
        }
        const isMatchPassword = await UserEmail.comparePassword(password)
        if(isMatchPassword){
            generateTokenAndCookieSet(existingUserByEmail._id,res)
            res.status(201).json({success:true,user:{
                ...existingUserByEmail._doc,
                password:""
            }})
        }else{
            res.status(404).send({success:false,message:'Password Not Match.'})
        }
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const logout = async(req,res)=>{
    try {
        res.clearCookie('jwt-taskManager');
        res.status(201).json({success:true,message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}


const EmailVerify = async(req,res)=>{
    try {
        let {email} = req.body
        let EmailVerify = await User.findOne({email:email})
        if(EmailVerify){
            const otpExpiry = Date.now() + 60 * 60 * 1000;
            const mailoptions={
                from:process.env.user,
                to:email,
                subject:"reset password",
                html: `
                    <h3>Password Reset Request</h3>
                    <p>You (or someone else) have requested a password reset. If this was you, click the link below to reset your password:</p>
                    <h1> ${otp}</h1>
                    <p>This link is valid for 1 hour.</p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                    <p>Thank you,<br>Task Manager App</p>
                `,
            }
            transport.sendMail(mailoptions,(err,done)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(done)
                }
            })
            res.status(201).json({success:true,message:"Email Verify successfully",data:EmailVerify})
        }else{
            res.status(400).json({success:false,message:"Email Not Verify...."})
        }

    } catch (error) {
        console.log("Error in EmailVerify controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const OTPverify=async(req,res)=>{
    try{
        let {UserOtp}=req.body

    if(otp==UserOtp){
        res.status(201).json({success:true,message:"OTP Verify successfully"})
    }
    else{
        res.status(201).json({success:true,message:"OTP NOT Verify.."})
    }
    }catch(error){
        console.log("OTPverify",error);
    }
}

const FrogetPassword=async(req,res)=>{
    try{
     let {id}=req.params
     let {password}=req.body
 
     if(id){
         bcrypt.hash(password,5,async(err,hash)=>{
            if(err){   
                 console.log(err)
             }else{
                 let obj={password:hash}
                 let data=await User.findByIdAndUpdate(id,obj)
                 console.log(data);
                 res.status(201).json({success:true,message:"Reset Your Password successfully.."})
             }
        })
     }
    }catch(error){
     console.log("Frogetpassword",error)
    }
 
 }

module.exports = {register,login,logout,EmailVerify,OTPverify,FrogetPassword}