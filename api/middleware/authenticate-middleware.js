// Import
const createError = require("../utils/create-error")
const tryCatch = require("../utils/try-catch")
const jwt = require('jsonwebtoken')
const prisma = require("../config/prisma-config")

const authenticate = tryCatch(async(req, res, next) => {

    // Check headers that has token sending
    const authorization = req.headers.authorization
    console.log("Authorization Header:", authorization);

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return createError(401, 'Unauthorized')
    }
    const token = authorization.split(' ')[1]
    if (!token) {
        return createError(401, 'Unauthorized')
    }
    // Decode which is verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    console.log("Payload from authen", payload)

    const foundUser = await prisma.user.findUnique({ where: { id: payload.id } })
    // console.log("Found User:", foundUser);
    if (!foundUser) {
        return createError(401, 'Unauthorized')
    }

    // delete foundUser.password
    const { password, createdAt, updatedAt, ...userData } = foundUser
    req.user = userData
    next()
})


module.exports = authenticate