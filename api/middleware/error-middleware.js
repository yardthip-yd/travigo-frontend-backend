const errorMiddleware = (err, req, res, next) => {
    console.log(err)
    const statusCode = err.statusCode || 500
    const errMessage = err.message || "Internet Server Error"
    res.status(statusCode).json({error: errMessage})
}

module.exports = errorMiddleware