// Import
const express = require("express")
const tripController = require("../controllers/trip-controller")
const tripRoute = express.Router()

// Import validator
const { tripValidator } = require("../middleware/trip-validator-middleware")

tripRoute.post("/create-trip", tripValidator, tripController.createTrip)

module.exports = tripRoute