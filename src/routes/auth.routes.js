const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
/* /user/auth/register */
router.post("/register",authController.userRegister)

/* /user/auth/login */
router.post("/login",authController.userLogin)

/* /user/auth/logout */
router.post("/logout",authController.userLogout)

/* /user/auth/fetchProfile */
router.get("/fetchProfile",authMiddleware.authUserMiddleware,authController.fetchProfile)

/* /user/auth/adminRegister */
router.post("/adminRegister",authMiddleware.authUserMiddleware,authController.adminRegister)

module.exports = router;