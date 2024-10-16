const notFoundMiddleware = (req, res) => {
    const statusCode = err.statusCode || 404
    const errMessage = err.message || "Path Not Found"
    res.status(statusCode).json({error: errMessage})
}

module.exports = notFoundMiddleware 