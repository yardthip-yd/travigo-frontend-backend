// Import
const tryCatch = require("../utils/try-catch")
const saveOrUpdateTripData = require("../services/trip-services");
const createError = require("../utils/create-error");
const prisma = require("../config/prisma-config");

const tripController = {}

tripController.createTrip = tryCatch(async (req, res) => {

    console.log("Received trip data from trip-cont", req.body)

    const tripData = req.input;
    // const result = await saveTripData(tripData);

    const result = await saveOrUpdateTripData(tripData, false);
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
        return createError(200, "No trips found for this user");
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

tripController.deleteHotel = tryCatch(async (req, res) => {
    const { tripId, hotelId } = req.params;

    if (!tripId || !hotelId) {
        return createError(400, "Trip ID and Hotel ID are required");
    }

    try {
        const deletedHotel = await prisma.hotel.delete({
            where: {
                id: parseInt(hotelId, 10),
            },
        });

        res.status(200).json({ message: "Hotel deleted successfully", deletedHotel });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        return createError(500, "Error deleting hotel. Please try again.");
    }
});

tripController.deletePlace = tryCatch(async (req, res) => {
    const { tripId, placeId } = req.params;

    if (!tripId || !placeId) {
        return createError(400, "Trip ID and Place ID are required");
    }

    try {
        const deletedPlace = await prisma.itinerary.delete({
            where: {
                id: parseInt(placeId, 10),
            },
        });

        res.status(200).json({ message: "Place deleted successfully", deletedPlace });
    } catch (error) {
        console.error("Error deleting place:", error);
        return createError(500, "Error deleting place. Please try again.");
    }
});

tripController.updateItineraryTime = tryCatch(async (req, res) => {

    console.log("Update itinerary time function called");

    const { tripId, placeId } = req.params;
    const { startTime, endTime } = req.body;

    // console.log("Trip ID:", tripId);
    // console.log("Place ID:", placeId);
    // console.log("Start Time:", startTime);
    // console.log("End Time:", endTime);

    if (!tripId || !placeId) {
        return createError(400, "Trip ID and Place ID are required");
    }

    try {
        const updatedItinerary = await prisma.itinerary.update({
            where: {
                id: parseInt(placeId, 10),
            },
            data: {
                startTime,
                endTime,
            },
        });

        res.status(200).json({ message: "Itinerary time updated successfully", updatedItinerary });
    } catch (error) {
        console.error("Error updating itinerary time:", error);
        return createError(500, "Error updating itinerary time. Please try again.");
    }
});

tripController.updateTrip = tryCatch(async (req, res) => {
    const { tripId } = req.params;
    const { days, budget, travelers, hotels = [], itinerary = [] } = req.body;

    console.log("Update Trip Request Data:", { tripId, days, budget, travelers, hotels, itinerary });
    
    // Validate inputs
    if (!tripId || !days || !budget || !travelers) {
        return createError(400, "All fields are required to update the trip.");
    }

    // Get the existing trip to keep destination unchanged
    const existingTrip = await prisma.trip.findUnique({
        where: { id: parseInt(tripId, 10) },
    });

    if (!existingTrip) {
        return createError(404, "Trip not found.");
    }

       // Update the trip data in the database using the updated saveOrUpdateTripData function
       const updatedTripData = {
        id: parseInt(tripId, 10),
        days: parseInt(days, 10),
        budget,
        travelers,
        hotels,
        itinerary,
        userId: existingTrip.userId,
        destination: existingTrip.destination,
    };

    const updatedTrip = await saveOrUpdateTripData(updatedTripData, true); // true for updating an existing trip
    
    
    res.json({
        message: "Trip updated successfully.",
        updatedTrip,
    });
});

module.exports = tripController