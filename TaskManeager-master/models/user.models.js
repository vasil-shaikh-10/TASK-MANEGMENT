const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    }
})
UserSchema.pre('save',async function (next) {
    let user = this;
    console.log("This",user)
    if (!user.isModified('password')) return next();
    try {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
        this.updatedAt = Date.now();
        next();
    } catch (error) {
        next(error);
    }
})

UserSchema.methods.comparePassword= async function(candidatePassword) {
    console.log("password",candidatePassword);
    
    try {
       return await bcrypt.compare(candidatePassword,this.password)
    } catch (error) {
        throw new Error ("Error comparing passwords");
    }
}
const User = mongoose.model('user',UserSchema)

module.exports=User