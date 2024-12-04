const {Router} = require('express')
const {register, logout, login, EmailVerify, OTPverify, FrogetPassword} = require('../../controllers/Auth/auth.controller')
const loginRateLimiter = require('../../middlewares/rateLimiting.middlewares')

const authRouter = Router()

authRouter.post("/register",register)
authRouter.post("/login",loginRateLimiter,login)
authRouter.post("/logout",logout)
authRouter.post("/emailVerify",EmailVerify)
authRouter.post("/OTPverify",OTPverify)
authRouter.post("/forgetPassword/:id",FrogetPassword)

module.exports=authRouter