// Import
const tryCatch = require("../utils/try-catch");

const gaiController = {};

gaiController.getKey = tryCatch(async (req, res) => {
    res.json({ aiKey: process.env.GOOGLE_GEMINI_API_KEY });
});

module.exports = gaiController;
