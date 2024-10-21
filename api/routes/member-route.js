// Import
const express = require("express")
const memberController = require("../controllers/member-controller")
const memberRoute = express.Router()

// Import authenticate
const authenticate = require("../middleware/authenticate-middleware")

// Import upload pic/img
const uploadAvatar = require("../middleware/cloudinary-upload-middleware")

// Fn check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied: Admins only." });
    }
    next();
};

memberRoute.get("/", authenticate, checkAdmin, memberController.listMember)
memberRoute.patch("/:memberId", authenticate, checkAdmin, uploadAvatar.single("profileImage"), memberController.updateMember)
memberRoute.delete("/:memberId", authenticate, checkAdmin, memberController.removeMember)

module.exports = memberRoute