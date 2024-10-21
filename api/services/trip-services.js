// Import
const prisma = require("../config/prisma-config");

// Fn to save trip data
const saveTripData = async (tripData) => {

    // Log received trip data to check its structure
    console.log("Received trip data:", tripData);

    // Ensure the budget and travelers are valid strings
    const validBudgets = ["Economy", "Normal", "Luxury"];
    const validTravelers = ["Solo", "Couple", "Family", "Friends"];

    if (!validBudgets.includes(tripData.budget) || !validTravelers.includes(tripData.travelers)) {
        throw new Error("Invalid budget or traveler type");
    }

    // Create a new trip entry in the database from the input data
    const trip = await prisma.trip.create({
        data: {
            destination: tripData.destination,
            budget: tripData.budget,
            travelers: tripData.travelers,
            days: tripData.days,
            userId: tripData.userId,
        },
    });

    // Save hotels in the database
    if (tripData.jsonResponse?.hotelOptions && tripData.jsonResponse.hotelOptions.length > 0) {
        for (const hotel of tripData.jsonResponse.hotelOptions) {
            await prisma.hotel.create({
                data: {
                    tripId: trip.id,
                    hotelName: hotel.HotelName,
                    hotelAddress: hotel.HotelAddress,
                    hotelPrice: parseFloat(hotel.HotelPrice),
                    hotelImageUrl: hotel.HotelImageURL,
                    hotelRating: hotel.HotelRating,
                    hotelDescription: hotel.HotelDescription,
                    latitude: parseFloat(hotel.HotelGeoCoordinates.latitude),
                    longtitude: parseFloat(hotel.HotelGeoCoordinates.longitude),
                },
            });
        }
    } else {
        console.warn("No hotel options available in the response");
    }

    // Save itinerary in the database
    if (tripData.jsonResponse?.itinerary && tripData.jsonResponse.itinerary.length > 0) {
        for (const day of tripData.jsonResponse.itinerary) {
            for (const plan of day.DayPlan) {
                await prisma.itinerary.create({
                    data: {
                        tripId: trip.id,
                        day: day.Day, // Day of the itinerary
                        placeName: plan.PlaceName,
                        placeDescription: plan.PlaceDetails,
                        placeImageUrl: plan.PlaceImageURL,
                        ticketPrice: parseFloat(plan.TicketPricing) || 0,
                        latitude: parseFloat(plan.PlaceGeoCoordinates.latitude),
                        longtitude: parseFloat(plan.PlaceGeoCoordinates.longitude), 
                        startTime: plan.StartTime,
                        endTime: plan.EndTime,
                    },
                });
            }
        }

        // console.log("Trip Data for Itinerary:", tripData.jsonResponse.itinerary);
    } else {
        console.warn("No itinerary data available in the response");
    }

    return trip;
};

module.exports = saveTripData;
