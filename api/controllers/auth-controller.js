// Import
const prisma = require("../config/prisma-config");
const tryCatch = require("../utils/try-catch");
const createError = require("../utils/create-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const authController = {};

authController.register = tryCatch(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

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
    const passwordCorrect = await bcrypt.compare(password, findUser.password)
    if (!passwordCorrect) {
        return createError(400, "Password is not match")
    }

    // 3. Create Payload
    const payload = {
        id: findUser.id,
    }

    // 4. Generate Token
    const genToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
    console.log("Generate Token", genToken)

    const { createdAt, updatedAt,...userData } = findUser

    // res.send("Hello Login");
    res.json({ token: genToken, user: userData})
});

module.exports = authController;
