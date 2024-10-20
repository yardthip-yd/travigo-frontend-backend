// Import
const express = require("express")
const authController = require("../controllers/auth-controller")
const authRoute = express.Router()

// Import validator
const { registerValidator, loginValidator } = require("../middleware/auth-validator-middleware")

// Import authenticate
const authenticate = require("../middleware/authenticate-middleware")

// Import upload pic/img
const uploadAvatar = require("../middleware/cloudinary-upload-middleware")


authRoute.post("/register", registerValidator, authController.register)
authRoute.post("/login", loginValidator, authController.login)
authRoute.get("/getme", authenticate ,authController.currentUser)
authRoute.put("/updateme", authenticate, uploadAvatar.single("profileImage"), authController.updateUser)

module.exports = authRoute