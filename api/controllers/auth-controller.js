// Import
const prisma = require("../config/prisma-config");
const tryCatch = require("../utils/try-catch");
const createError = require("../utils/create-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inport for reset password
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Import Cloudinary
const cloudinary = require("../config/cloudinary-config");
const fs = require("fs");
const path = require("path");

const authController = {};

authController.register = tryCatch(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.input;

    // 1. Validation by joi in validation.js
    // 2. Check in database that Email already exist
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (user) {
        return createError(400, "Email is already exist");
    }

    // 3. Check password match with confirm password
    if (password !== confirmPassword) {
        return createError(400, "Password do not match");
    }

    // 4. Encrypt password by bcryptjs
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hash Password", hashPassword);

    // 5. Register success then create user in database
    const newUser = {
        firstName,
        lastName,
        email: email,
        password: hashPassword,
    };
    const result = await prisma.user.create({ data: newUser });

    res.json({ message: "Register successful", result });
    // res.send("Hello Register");
});

authController.login = tryCatch(async (req, res) => {
    const { email, password } = req.body;

    //  1. Check user in database Email alresy exist
    const findUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!findUser) {
        return createError(400, "Email is not invalid");
    }

    // 2. Check Password is match
    const passwordCorrect = await bcrypt.compare(password, findUser.password);
    if (!passwordCorrect) {
        return createError(400, "Password is not match");
    }

    // 3. Create Payload
    const payload = {
        id: findUser.id,
    };

    // 4. Generate Token
    const genToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    // console.log("Generate Token from auth-cont", genToken);

    const { createdAt, updatedAt, ...userData } = findUser;

    // res.send("Hello Login");
    res.json({ token: genToken, user: userData });
});

authController.currentUser = tryCatch(async (req, res) => {
    res.json({ message: "Hello current user", user: req.user });
});

authController.updateUser = tryCatch(async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, email, password } = req.body;

    console.log("Received update request from auth-cont:", req.body);

    // 1. Check user exists in the database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return createError(404, "User not found");
    }

    // 2. Update user details
    const updatedData = {
        firstName,
        lastName,
        email,
    };

    // 3. Check if a new password is provided
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
    }

    // 4. Check if an avatar exists and handle profile image upload if a new file is provided
    if (req.file) {
        console.log("File uploaded:", req.file);

        // Get the public ID of the existing image from the user's data
        const existingImagePublicId = user.profileImage ? path.parse(user.profileImage).name : null;

        // If there is an existing image, delete it from Cloudinary
        if (existingImagePublicId) {
            try {
                await cloudinary.uploader.destroy(existingImagePublicId);
                console.log("Existing image deleted from Cloudinary.");
            } catch (error) {
                console.error("Failed to delete existing image from Cloudinary:", error);
            }
        }

        // Upload avatar to Cloudinary
        try {
            console.log("Uploading image to Cloudinary...");
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: path.parse(req.file.path).name,
                timeout: 60000
            });

            console.log("Upload successful:", uploadResult);
            // Save the secure URL to the profileImage field
            updatedData.profileImage = uploadResult.secure_url;

            // Delete the local file after upload
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Failed to delete local file:", err);
                } else {
                    console.log("Local file deleted successfully.");
                }
            });
        } catch (error) {
            console.error("Upload failed:", error);
            return createError(500, "Failed to upload image");
        }
    }

    // 5. Update the user in the database
    await prisma.user.update({
        where: { id: userId },
        data: updatedData,
    });

    return res.json({
        message: "User updated successfully",
        user: updatedData,
    });
});

authController.sendResetLink = tryCatch(async (req, res) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return createError(404, "Email not found");
    }

    // Generate a unique token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store the token in the database
    await prisma.user.update({
        where: { email },
        data: { resetToken }, // Consider adding an expiration field as well
    });

    // Send the email with the reset link
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        debug: true, 
    });

    // Create the link to reset password
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`; 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Link",
        text: `Click on this link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions); // Send the email

    res.status(200).json({ message: "Reset link sent to your email!" });
});


authController.resetPassword = tryCatch(async (req, res) => {
    const { token } = req.params; // Get the reset token from the URL
    const { newPassword } = req.body; // Get the new password from the request body

    console.log("Received token:", token)
    console.log("Received new password:", newPassword);

    // Find the user by reset token
    const user = await prisma.user.findFirst({
        where: { resetToken: token },
    });

    if (!user) {
        return createError(404, "Invalid or expired token");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear the reset token
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
        },
    });

    res.status(200).json({ message: "Password has been reset successfully!" });
});

authController.getResetPasswordPage = tryCatch(async (req, res) => {
    const { token } = req.params;

    // console.log("Received token for validation:", token); 
    
    const user = await prisma.user.findFirst({
        where: { resetToken: token },
    });

    if (!user) {
        return createError(404, "Invalid or expired token");
    }

    res.status(200).json({ message: "Token is valid from auth-cont", token });
});

module.exports = authController;
