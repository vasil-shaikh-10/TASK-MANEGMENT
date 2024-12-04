const express = require('express')
const helmet = require('helmet');
const cookieparser = require('cookie-parser')
const Databse = require('./configs/db.config')
const authRouter = require('./routers/Auth/auth.router')
const taskRouter = require('./routers/Task/task.router')
const TaskMange = require('./middlewares/taskManage.middlewares')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())
app.use(helmet());

app.use('/auth',authRouter)
app.use('/task',TaskMange,taskRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server Start`)
    Databse()
})