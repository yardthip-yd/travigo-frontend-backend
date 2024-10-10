// Import
const tryCatch = require("../utils/try-catch");

const gaiController = {};

gaiController.getKey = tryCatch(async (req, res) => {
    res.json({ gaiKey: process.env.GOOGLE_GEMINI_API_KEY });
});

module.exports = gaiController;
