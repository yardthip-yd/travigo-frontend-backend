// Import
const tryCatch = require("../utils/try-catch")
const saveTripData = require("../services/trip-services");

const tripController = {}

tripController.createTrip = tryCatch(async(req, res) => {

    console.log("Received trip data:", req.body)
    
    const tripData = req.input;
    const result = await saveTripData(tripData);
    res.json({ message: "Saving trip data successful", result });
})

module.exports = tripController;