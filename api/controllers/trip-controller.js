// Import
const tryCatch = require("../utils/try-catch")
const saveTripData = require("../services/trip-services");
const createError = require("../utils/create-error");
const prisma = require("../config/prisma-config");

const tripController = {}

tripController.createTrip = tryCatch(async (req, res) => {

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

tripController.getUserTrips = tryCatch(async (req, res) => {

    // console.log("Request User:", req.user)
    const userId = req.user.id;

    if (!userId) {
        return createError(400, "User ID is required");
    }

    // console.log("User Id from controller", userId)

    const trips = await prisma.trip.findMany({
        where: {
            userId: userId,
        },
        include: {
            Hotel: true,
            Itinerary: true,
        },
    });

    if (trips.length === 0) {
        return createError(404, "No trips found for this user");
    }

    res.json({ message: "Get user trips successful", trips });
});

tripController.deleteTrip = tryCatch(async (req, res) => {
    const { tripId } = req.body; // รับ tripId จาก request body

    if (!tripId) {
        return createError(400, "Trip ID is required");
    }

    const deletedTrip = await prisma.trip.delete({
        where: {
            id: parseInt(tripId, 10),
        },
    });


    res.status(200).json({ message: "Trip deleted successfully", deletedTrip });
});

module.exports = tripController;