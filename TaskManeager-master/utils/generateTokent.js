const jwt = require('jsonwebtoken')
require('dotenv').config()
const generateTokenAndCookieSet = async(userID,res)=>{
    const token = jwt.sign({userID},process.env.JWT_SECRET,{expiresIn:'15d'})
    res.cookie("jwt-taskManager",token,{
        maxAge:15 * 24 * 60 * 60 * 1000, // 15 days in MS
        httpOnly:true,
        sameSite:"strict"
    })
    return token;
}

module.exports=generateTokenAndCookieSet