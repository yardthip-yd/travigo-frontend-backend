// Import
const tryCatch = require("../utils/try-catch");

const gplaceController = {};

gplaceController.getKey = tryCatch(async (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_PLACE_API_KEY });
});

module.exports = gplaceController;