// Import
const express = require("express");
const gaiController = require("../controllers/gai-controller");
const gaiRoute = express.Router();

gaiRoute.get('/get-gai-key', gaiController.getKey);

module.exports = gaiRoute;