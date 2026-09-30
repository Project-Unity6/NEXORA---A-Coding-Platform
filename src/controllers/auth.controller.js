const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const validateUser = require("../utils/user.validator")
const {getUserProfile} = require("../services/userprofile.service")


async function userRegister(req,res) {
    const {username,email,password,role} = req.body;
    //validation
    const {isValid,message} = validateUser.validateRegisterUserData(req.body)
    if(!isValid){
        return res.status(400).json({message})
    }

    const isUserPresent = await userModel.findOne({
        $or:[{email:email},{username:username}]
    });

    if(isUserPresent){
        return res.status(409).json({message:"User already exists"})
    }

    try{
         const hashedPassword = await bcrypt.hash(password,12);
         const newUser = await userModel.create({username:username,email:email,password:hashedPassword,role:"user"})

         const token = jwt.sign({email,id:newUser._id},process.env.JWT_SECRET,{expiresIn:"30d"})
         res.cookie("token",token)

         return res.status(201).json({message:"User registered successfully", user: {
   id: newUser._id,
   username: newUser.username,
   email: newUser.email,
   role: newUser.role
}})
    }
    catch(err){
        console.error("Error registering user:", err);
        return res.status(500).json({message:"Internal server error"})
    }
}



async function userLogin(req,res) {
    const {email,password} = req.body;
    //validateUserLoginData
    const {isValid,message} = await validateUser.validateLoginUserData(req.body)
    if(!isValid){
        return res.status(400).json({message})
    }
    try{
        const user = await userModel.findOne({email:email}).select("+password")

        if(!user){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({email:user.email,id:user._id},process.env.JWT_SECRET,{expiresIn:"30d"})
        res.cookie("token",token)
        return res.status(200).json({message:"User logged in successfully", user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }})
    }
    catch(err){
        console.error("Error during user login:", err);
        return res.status(500).json({message:"Internal server error"})
    }
}


async function userLogout(req,res) {
    res.clearCookie("token")
    return res.status(200).json({message:"User logged out successfully"})
}


async function fetchProfile(req, res) {

    try {

        const userId = req.userData._id;

       const currentYear = new Date().getFullYear();

       let year = Number(req.query.year);

       if (!Number.isInteger(year) || year < 2000 || year > currentYear) {
            year = currentYear;
        }

        const profile = await getUserProfile(userId, year);

        return res.status(200).json({
            success: true,
            data: profile
        });

    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}


async function adminRegister(req,res) {
    //verify if the user requesting is admin or not through token
    if(req.userData.role !== "admin"){
        return res.status(403).json({message:"Forbidden: Admins only"})
    }
        const {username,email,password,role} = req.body;
    //validation
    const {isValid,message} = validateUser.validateRegisterUserData(req.body)
    if(!isValid){
        return res.status(400).json({message})
    }

    const isUserPresent = await userModel.findOne({
        $or:[{email:email},{username:username}]
    });

    if(isUserPresent){
        return res.status(409).json({message:"Admin already exists"})
    }

    try{
         const hashedPassword = await bcrypt.hash(password,12);
         const newUser = await userModel.create({username:username,email:email,password:hashedPassword,role:"admin"})

         return res.status(201).json({message:"Admin created successfully", user: {
   id: newUser._id,
   username: newUser.username,
   email: newUser.email,
   role: newUser.role
}})
    }
    catch(err){
        console.error("Error registering admin:", err);
        return res.status(500).json({message:"Internal server error"})
    }
}


module.exports = {userRegister,userLogin,userLogout,fetchProfile,adminRegister}