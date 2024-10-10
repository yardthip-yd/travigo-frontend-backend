// Import
const express = require("express");
const gplaceController = require("../controllers/gplace-controller");
const gplaceRoute = express.Router();

gplaceRoute.get('/get-gplace-key', gplaceController.getKey);

module.exports = gplaceRoute;