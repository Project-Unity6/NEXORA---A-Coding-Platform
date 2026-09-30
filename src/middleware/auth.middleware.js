const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")


async function authUserMiddleware(req, res, next) {

    const token =
        req.cookies.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"})
        }

        const user = await userModel
            .findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.userData = user;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}



async function optionalAuthUserMiddleware(req, res, next) {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        req.userData = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            req.userData = null;
            return next();
        }

        const user = await userModel
            .findById(decoded.id)
            .select("-password");

        req.userData = user || null;
        next();
    } catch (err) {
        req.userData = null;
        next();
    }
}

module.exports = {authUserMiddleware, optionalAuthUserMiddleware}