// Import
const express = require("express")
const authController = require("../controllers/auth-controller")
const authRoute = express.Router()

// Import validator
const { registerValidator, loginValidator } = require("../middleware/auth-validator-middleware")

// Import authenticate
const authenticate = require("../middleware/authenticate-middleware")


authRoute.post("/register", registerValidator, authController.register)
authRoute.post("/login", loginValidator, authController.login)
authRoute.get("/me", authenticate ,authController.currentUser)

module.exports = authRoute