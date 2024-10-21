// Import
const tryCatch = require("../utils/try-catch")
const saveTripData = require("../services/trip-services");
const createError = require("../utils/create-error");
const prisma = require("../config/prisma-config");

const tripController = {}

tripController.createTrip = tryCatch(async(req, res) => {

    console.log("Received trip data:", req.body)

    const tripData = req.input;
    const result = await saveTripData(tripData);
    res.json({ message: "Saving trip data successful", result });
})

tripController.getTrip = tryCatch(async (req, res) => {
    const { tripId } = req.params;
    
    if (!tripId) {
        return createError(401, "Cannot get trip");
    }
    
    console.log("Trip Id from controller", tripId)
    
    const trip = await prisma.trip.findUnique({
        where: {
            id: parseInt(tripId, 10),
        },
        include: {
            Hotel: true, 
            Itinerary: true,
        },
    });
    
    console.log("Trip from controller", trip)
    
    if (!trip) {
        return createError(404, "Trip not found")
    }

    res.json({ message: "Get trip by id successful", trip });
    // res.json(trip);
});

module.exports = tripController;