const notFoundMiddleware = (req, res) => {
    const statusCode = 404
    const errMessage = "Path Not Found"
    res.status(statusCode).json({error: errMessage})
}

module.exports = notFoundMiddleware