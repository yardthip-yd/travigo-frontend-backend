// Import
const tryCatch = require("../utils/try-catch")
const saveTripData = require("../services/trip-services");
const createError = require("../utils/create-error");
const prisma = require("../config/prisma-config");

const tripController = {}

tripController.createTrip = tryCatch(async (req, res) => {

    console.log("Received trip data from trip-cont", req.body)

    const tripData = req.input;
    const result = await saveTripData(tripData);
    res.json({ message: "Saving trip data successful", result });


    // const tripData = req.body; // Update to use req.body
    // const { trip, savedHotels, savedItinerary } = await saveTripData(tripData); // Destructure the result

    // // Send response with trip, hotels, and itinerary
    // res.status(201).json({
    //     message: "Saving trip data successful",
    //     result: {
    //         trip,
    //         hotels: savedHotels,
    //         itinerary: savedItinerary
    //     }
    // });

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

tripController.updateTrip = tryCatch(async (req, res) => {
    const { tripId } = req.params;
    const tripData = req.body;

    // Log the trip ID and incoming data
    console.log("Updating trip with ID:", tripId);
    console.log("Received trip data:", tripData);
    console.log("Itinerary data:", tripData.itinerary[0].Places[0].PlaceName);

    tripData.itinerary.forEach(day => {
        console.log(`Day: ${day.Day}`);
        if (day.Places && Array.isArray(day.Places)) {
            day.Places.forEach(place => {
                console.log(`Place Name: ${place.PlaceName}`);
            });
        } else {
            console.log("No places found for this day.");
        }
    });

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
                Hotel: {
                    create: tripData.hotels.map(hotel => ({
                        hotelName: hotel.HotelName,
                        hotelAddress: hotel.HotelAddress,
                        hotelPrice: parseFloat(hotel.HotelPrice),
                        hotelRating: parseFloat(hotel.HotelRating),
                        hotelDescription: hotel.HotelDescription,
                        latitude: parseFloat(hotel.HotelGeoCoordinates.latitude),
                        longitude: parseFloat(hotel.HotelGeoCoordinates.longitude),
                    })),
                },
                Itinerary: {
                    create: tripData.itinerary.map(day => ({
                        day: parseInt(day.Day, 10),
                        Places: {
                            create: day.Places.map(plan => ({
                                placeName: plan.PlaceName,
                                placeDescription: plan.PlaceDetails,
                                ticketPrice: parseFloat(plan.TicketPricing) || 0,
                                latitude: parseFloat(plan.PlaceGeoCoordinates.latitude),
                                longitude: parseFloat(plan.PlaceGeoCoordinates.longitude),
                                startTime: plan.StartTime || null,
                                endTime: plan.EndTime || null,
                            })),
                        },
                    })),
                },
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

tripController.updateHotelsAndItinerary = tryCatch(async (req, res) => {
    const { tripId } = req.params;
    const { hotels, itinerary } = req.body;

    if (!tripId) {
        return createError(400, "Trip ID is required");
    }

    try {
        // Update hotels
        if (hotels && Array.isArray(hotels)) {
            for (const hotel of hotels) {
                if (!hotel.HotelName) {
                    continue;
                }
                await prisma.hotel.update({
                    where: {
                        tripId: parseInt(tripId, 10),
                        hotelName: hotel.HotelName,
                    },
                    data: {
                        hotelAddress: hotel.HotelAddress,
                        hotelPrice: hotel.HotelPrice,
                        hotelRating: parseFloat(hotel.HotelRating) || 0,
                        hotelDescription: hotel.HotelDescription,
                        latitude: parseFloat(hotel.HotelGeoCoordinates.latitude),
                        longitude: parseFloat(place.PlaceGeoCoordinates.longitude)
                    },
                });
            }
        }

        // Update itinerary
        if (itinerary && Array.isArray(itinerary)) {
            for (const day of itinerary) {
                if (!day.Day) {
                    continue;
                }
                for (const place of day.Places) {
                    await prisma.itinerary.update({
                        where: {
                            tripId: parseInt(tripId, 10),
                            day: day.Day,
                            placeName: place.PlaceName,
                        },
                        data: {
                            placeDescription: place.PlaceDetails,
                            ticketPrice: parseFloat(place.TicketPricing) || 0,
                            latitude: parseFloat(place.PlaceGeoCoordinates.latitude),
                            longitude: parseFloat(place.PlaceGeoCoordinates.longitude),
                            startTime: place.StartTime,
                            endTime: place.EndTime,
                        },
                    });
                }
            }
        }

        res.status(200).json({ message: "Hotels and itinerary updated successfully." });
    } catch (error) {
        console.error("Error updating hotels and itinerary:", error);
        return createError(500, "Error updating hotels and itinerary. Please try again.");
    }
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


module.exports = tripController