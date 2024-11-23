// // Import
// const prisma = require("../config/prisma-config");
// const tryCatch = require("../utils/try-catch");

// // Fn to save trip data
// const saveTripData = tryCatch(async (tripData) => {

//     // Log received trip data to check its structure
//     console.log("Received trip data from trip service", tripData);

//     // Ensure the budget and travelers are valid strings
//     const validBudgets = ["Economy", "Normal", "Luxury"];
//     const validTravelers = ["Solo", "Couple", "Family", "Friends"];

//     if (!validBudgets.includes(tripData.budget) || !validTravelers.includes(tripData.travelers)) {
//         throw new Error("Invalid budget or traveler type");
//     }

//     // Create a new trip entry in the database from the input data
//     const trip = await prisma.trip.create({
//         data: {
//             destination: tripData.destination,
//             budget: tripData.budget,
//             travelers: tripData.travelers,
//             days: tripData.days,
//             userId: tripData.userId,
//         },
//     });

//     // Save hotels in the database
//     if (tripData.jsonResponse?.HotelOptions && tripData.jsonResponse.HotelOptions.length > 0) {
//         for (const hotel of tripData.jsonResponse.HotelOptions) {
//             await prisma.hotel.create({
//                 data: {
//                     tripId: trip.id,
//                     hotelName: hotel.HotelName,
//                     hotelAddress: hotel.HotelAddress,
//                     hotelPrice: parseFloat(hotel.HotelPrice),
//                     hotelRating: parseFloat(hotel.HotelRating),
//                     hotelDescription: hotel.HotelDescription,
//                     latitude: parseFloat(hotel.HotelGeoCoordinates.latitude),
//                     longitude: parseFloat(hotel.HotelGeoCoordinates.longitude),
//                 },
//             });
//         }
//     } else {
//         console.warn("No hotel options available in the response");
//     }

//     // Save itinerary in the database
//     if (tripData.jsonResponse?.Itinerary && tripData.jsonResponse.Itinerary.length > 0) {
//         for (const day of tripData.jsonResponse.Itinerary) {
//             for (const plan of day.Places) {
//                 await prisma.itinerary.create({
//                     data: {
//                         tripId: trip.id,
//                         day: parseInt(day.Day, 10), // Day of the itinerary
//                         placeName: plan.PlaceName,
//                         placeDescription: plan.PlaceDetails,
//                         ticketPrice: parseFloat(plan.TicketPricing) || 0,
//                         latitude: parseFloat(plan.PlaceGeoCoordinates.latitude),
//                         longitude: parseFloat(plan.PlaceGeoCoordinates.longitude), 
//                         startTime: plan.StartTime || null,
//                         endTime: plan.EndTime || null,
//                     },
//                 });
//             }
//         }
//         // console.log("Trip Data for Itinerary:", tripData.jsonResponse.itinerary);
//     } else {
//         console.warn("No itinerary data available in the response");
//     }

//     return trip;
// })

// module.exports = saveTripData;


// Import
const prisma = require("../config/prisma-config");

// Fn to save or update trip data
const saveOrUpdateTripData = async (tripData, isUpdate = false) => {

    // Log received trip data to check its structure
    console.log("Received trip data from trip service", tripData);

    // Ensure the budget and travelers are valid strings
    const validBudgets = ["Economy", "Normal", "Luxury"];
    const validTravelers = ["Solo", "Couple", "Family", "Friends"];

    if (!validBudgets.includes(tripData.budget) || !validTravelers.includes(tripData.travelers)) {
        throw new Error("Invalid budget or traveler type");
    }

    // Check if it's an update or a new trip
    let trip;
    if (isUpdate && tripData.id) {
        // Update existing trip
        trip = await prisma.trip.update({
            where: { id: tripData.id },
            data: {
                destination: tripData.destination,
                budget: tripData.budget,
                travelers: tripData.travelers,
                days: tripData.days,
                userId: tripData.userId,
            },
        });
    } else {
        // Create a new trip entry in the database
        trip = await prisma.trip.create({
            data: {
                destination: tripData.destination,
                budget: tripData.budget,
                travelers: tripData.travelers,
                days: tripData.days,
                userId: tripData.userId,
            },
        });
    }

    // Save or update hotels in the database
    if (tripData.hotels && tripData.hotels.length > 0) {
        const hotelPromises = tripData.hotels.map(async (hotel) => {
            // ตรวจสอบว่ามีโรงแรมนี้ในฐานข้อมูลอยู่แล้วหรือไม่
            const existingHotel = await prisma.hotel.findUnique({
                where: {
                    tripId_hotelName: {
                        tripId: trip.id,
                        hotelName: hotel.HotelName,
                    }
                }
            });

            if (existingHotel) {
                // อัปเดตข้อมูลโรงแรมที่มีอยู่แล้ว
                await prisma.hotel.update({
                    where: {
                        id: existingHotel.id
                    },
                    data: {
                        hotelAddress: hotel.HotelAddress,
                        hotelPrice: parseFloat(hotel.HotelPrice),
                        hotelRating: parseFloat(hotel.HotelRating),
                        hotelDescription: hotel.HotelDescription,
                        latitude: parseFloat(hotel.HotelGeoCoordinates.latitude),
                        longitude: parseFloat(hotel.HotelGeoCoordinates.longitude),
                    }
                });
            } else {
                // สร้างโรงแรมใหม่
                await prisma.hotel.create({
                    data: {
                        tripId: trip.id,
                        hotelName: hotel.HotelName,
                        hotelAddress: hotel.HotelAddress,
                        hotelPrice: parseFloat(hotel.HotelPrice),
                        hotelRating: parseFloat(hotel.HotelRating),
                        hotelDescription: hotel.HotelDescription,
                        latitude: parseFloat(hotel.HotelGeoCoordinates.latitude),
                        longitude: parseFloat(hotel.HotelGeoCoordinates.longitude),
                    }
                });
            }
        });

        await Promise.all(hotelPromises);
    } else {
        console.warn("No hotel options available in the response");
    }

    // Save or update itinerary in the database
    if (tripData.itinerary && tripData.itinerary.length > 0) {
        const itineraryPromises = tripData.itinerary.map(async (day) => {
            const placePromises = day.Places.map(async (plan) => {
                await prisma.itinerary.upsert({
                    where: {
                        tripId_day_placeName: {
                            tripId: trip.id,
                            day: parseInt(day.Day, 10),
                            placeName: plan.PlaceName,
                        }
                    },
                    update: {
                        placeDescription: plan.PlaceDetails,
                        ticketPrice: parseFloat(plan.TicketPricing) || 0,
                        latitude: parseFloat(plan.PlaceGeoCoordinates.latitude),
                        longitude: parseFloat(plan.PlaceGeoCoordinates.longitude),
                        startTime: plan.StartTime || null,
                        endTime: plan.EndTime || null,
                    },
                    create: {
                        tripId: trip.id,
                        day: parseInt(day.Day, 10),
                        placeName: plan.PlaceName,
                        placeDescription: plan.PlaceDetails,
                        ticketPrice: parseFloat(plan.TicketPricing) || 0,
                        latitude: parseFloat(plan.PlaceGeoCoordinates.latitude),
                        longitude: parseFloat(plan.PlaceGeoCoordinates.longitude),
                        startTime: plan.StartTime || null,
                        endTime: plan.EndTime || null,
                    },
                });
            });
            await Promise.all(placePromises);
        });
        await Promise.all(itineraryPromises);
    } else {
        console.warn("No itinerary data available in the response");
    }

    return trip;
};

module.exports = saveOrUpdateTripData;