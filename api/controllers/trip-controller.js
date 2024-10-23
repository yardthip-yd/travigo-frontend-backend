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

tripController.updateTrip = tryCatch(async (req, res) => {
    const { tripId } = req.params;
    const tripData = req.body;

    // Log the trip ID and incoming data
    console.log("Updating trip with ID:", tripId);
    console.log("Received trip data:", tripData);

    if (!tripId) {
        return createError(400, "Trip ID is required");
    }

    try {
        // Perform the update operation using Prisma
        const updatedTrip = await prisma.trip.update({
            where: {
                id: parseInt(tripId, 10),
            },
            data: {
                destination: tripData.destination,
                travelers: tripData.travelers, 
                budget: tripData.budget,
                days: tripData.days,
            },
        });

        // Log successful update
        console.log("Trip updated successfully:", updatedTrip);
        res.json({ message: "Trip updated successfully", updatedTrip });

    } catch (error) {
        // Log the error if the update fails
        console.error("Error updating trip:", error);
        return createError(500, "Error updating trip. Please try again.");
    }
});

module.exports = tripController;