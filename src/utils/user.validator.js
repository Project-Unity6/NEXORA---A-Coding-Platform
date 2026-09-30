const validator = require("validator")

function validateRegisterUserData(userData){
    const {username,email,password} = userData;
    const mandatoryFields = ["username","email","password"]

    const isFieldMissing = mandatoryFields.every((field) => Object.keys(userData).includes(field))

    if(!isFieldMissing){
        return {isValid:false,message:"Missing required fields"}
    }

    if(!validator.isEmail(email)){
        return {isValid:false,message:"Invalid email format"}
    }

    if(!validator.isLength(username,{min:3,max:20})){
        return {isValid:false,message:"Username must be between 3 and 20 characters"}
    }
    if(!validator.isLength(password,{min:6})){
        return {isValid:false,message:"Password must be at least 6 characters long"}
    }
    
    if(!validator.isStrongPassword(password)){
        return {isValid:false,message:"Password is not strong enough"}
    }

    return {isValid:true,message:"User data is valid"}
}



async function validateLoginUserData(userData){
    const {email,password} = userData;
    const mandatoryFields = ["email","password"]

    const isFieldMissing = mandatoryFields.every((field) => Object.keys(userData).includes(field))

    if(!isFieldMissing){
        return {isValid:false,message:"Missing required fields"}
    }

    if(!validator.isEmail(email)){
        return {isValid:false,message:"Invalid email format"}
    }

    if(!validator.isLength(password,{min:6})){
        return {isValid:false,message:"Password must be at least 6 characters long"}
    }

    return {isValid:true,message:"User data is valid"}
}



module.exports = {validateRegisterUserData,validateLoginUserData};


