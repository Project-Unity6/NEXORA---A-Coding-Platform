const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        maxLength:20,
        minLength:3,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        immutable:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        select:false
    }
},{timestamps:true})

const userModel = mongoose.model("User",userSchema)

module.exports = userModel;