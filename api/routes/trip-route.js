// Import
const express = require("express")
const tripController = require("../controllers/trip-controller")
const tripRoute = express.Router()

// Import validator
const { tripValidator } = require("../middleware/trip-validator-middleware")

// Import authenticate
const authenticate = require("../middleware/authenticate-middleware")

// Route for Create Trip
tripRoute.post("/create-trip", authenticate, tripValidator, tripController.createTrip)

// Route for View Trip
tripRoute.get("/view-trip/:tripId", authenticate, tripController.getTrip)

// Route for My Trip
tripRoute.get("/user-trip", authenticate, tripController.getUserTrips);
tripRoute.delete("/delete", authenticate, tripController.deleteTrip);
tripRoute.put("/update-trip/:tripId", authenticate, tripController.updateTrip);

module.exports = tripRoute