// Import
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import DefaultImage from "@/assets/image/pixabay.gif";
import { Link } from "react-router-dom";
import axios from "axios"

// Import component for update and delete
import MenuMainTrip from "@/components/trips/MenuMainTrip";
import UpdateTripModel from "@/components/trips/UpdateTripModel";

// Import Store
import useTripStore from "@/stores/tripStore";

// Import GPlace
import { googlePlaceKey } from "@/services/GPlaceService";

// Import GPlace Photo
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GMPlaceService";

// Import GAI
import { createChatSession } from "@/services/GAiService"
import AI_PROMPT from "@/components/options/AiGen";

const UserCardMyTrip = () => {
    // State from Stores
    const { trips, actionGetUserTrips, loading, error, actionUpdateTrip } = useTripStore();

    // State for storing trip photo URLs
    const [tripPhotos, setTripPhotos] = useState({});

    // State for modal visibility and selected trip details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    // useEffect for fetch user trips
    useEffect(() => {
        actionGetUserTrips();
    }, [actionGetUserTrips]);

    // useEffect to fetch photos for each trip
    useEffect(() => {
        const fetchTripPhotos = async () => {
            const updatedTrips = [];
            // console.log("Trips to process:", trips);

            for (const trip of trips) {
                // console.log(`Fetching photo for destination: ${trip.destination}`);

                const photoUrl = await GetTripPhoto(trip.destination);
                // console.log(`Fetched photo URL: ${photoUrl} for destination: ${trip.destination}`);
                updatedTrips.push({ ...trip, photoUrl });
            }

            // console.log("Updated Trips with Photos:", updatedTrips[0].photoUrl);
            // console.log("Updated Trips with Photos:", updatedTrips);
            setTripPhotos(updatedTrips);
        };

        if (trips.length) {
            fetchTripPhotos();
        }
    }, [trips]);

    // Placeholder function to get trip photo URL
    const GetTripPhoto = async (destination) => {
        const data = { textQuery: destination };

        try {
            const result = await GetPlaceDetails(data);
            // console.log("Result data", result.data);

            const apiKey = await googlePlaceKey();
            // const photoName = result.data.places[0]?.photos[0]?.name;
            // console.log("Photo Name form my trip", photoName)

            // if (photoName) {
            //     return PHOTO_REF_URL(photoName, apiKey);
            // }

            const photos = result.data.places[0]?.photos;

            if (photos && photos.length > 0) {
                const photoName = photos[0].name;
                return PHOTO_REF_URL(photoName, apiKey);
            }
        } catch (error) {
            console.error("Error fetching trip photo:", error);
        }

        return DefaultImage;
    };

    // Fn to open modal
    const hdlOpenModal = (trip) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    // Fn to close modal
    const hdlCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTrip(null);
    };

    // Fn to handle trip updates
    const hdlUpdateTripAi = async (updatedData) => {
        console.log("Updated Trip Data:", updatedData);

        const FINAL_PROMPT = AI_PROMPT
            .replace("{destination}", updatedData.destination.trim())
            .replace("{totalDays}", updatedData.days)
            .replace("{traveler}", updatedData.travelers.trim())
            .replace("{budget}", updatedData.budget.trim());

        try {
            const chatSession = await createChatSession();
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            console.log("Raw response from AI:", result.response.text);

            let jsonResponse;

            try {
                jsonResponse = JSON.parse(result?.response?.text());
            } catch (parseError) {
                console.error("JSON parsing error:", parseError);
                console.error("Response text that caused the error:", result.response.text);
                toast.error("Error parsing AI response. Please try again.");
                return;
            }

            console.log("JSON Response from AI from Card Trip", jsonResponse);


            // Prepare data to update in the database
            const updatedTripData = {
                destination: updatedData.destination,
                travelers: updatedData.travelers,
                budget: updatedData.budget,
                days: updatedData.days,
                hotels: jsonResponse.HotelOptions,
                itinerary: jsonResponse.Itinerary,
                // jsonResponse, // Include AI response for hotels and itinerary
            };

            // Update the trip data in the store
            await actionUpdateTrip({
                ...updatedTripData,
                id: selectedTrip.id,
                // jsonResponse, // Include AI response if needed
            });

            // Call the fn for update hotels and itinerary
            await updateHotelsAndItineraryToDatabase(selectedTrip.id, jsonResponse);

            await actionGetUserTrips();
            toast.success("Trip updated successfully!");

        } catch (error) {
            console.error("Error generating trip:", error);
            toast.error("Error updating trip. Please try again.");
        }

        hdlCloseModal(); // Close modal after update
    };

    // Fn for update hotels and itinerary in the database
    const updateHotelsAndItineraryToDatabase = async (tripId, jsonResponse) => {
        try {
            // Check if hotelOptions and itinerary are defined
            if (!jsonResponse.hotelOptions || !Array.isArray(jsonResponse.hotelOptions) || jsonResponse.hotelOptions.length === 0) {
                toast.error("No hotel options available in the response.");
                return;
            }

            if (!jsonResponse.itinerary || !Array.isArray(jsonResponse.itinerary)) {
                throw new Error("No itinerary available in the response.");
            }

            const hotels = jsonResponse.hotelOptions.map(hotel => ({
                hotelName: hotel.HotelName,
                hotelAddress: hotel.HotelAddress,
                hotelPrice: parseFloat(hotel.HotelPrice) || 0,
                hotelRating: parseFloat(hotel.HotelRating) || 0,
                hotelDescription: hotel.HotelDescription,
            }));

            const itinerary = jsonResponse.itinerary.flatMap(day => 
                day.Places.map(plan => ({
                    day: day.Day,
                    placeName: plan.PlaceName,
                    placeDescription: plan.PlaceDetails,
                    ticketPrice: parseFloat(plan.TicketPricing) || 0,
                    latitude: parseFloat(plan.PlaceGeoCoordinates.latitude),
                    longitude: parseFloat(plan.PlaceGeoCoordinates.longitude),
                    startTime: plan.StartTime,
                    endTime: plan.EndTime,
                }))
            );

            // Call API to update hotels and itinerary
            const response = await axios.put(`http://localhost:9900/trip/update-hotels-itinerary/${tripId}`, { hotels, itinerary });
            if (response.status !== 200) {
                throw new Error("Failed to update hotels and itinerary");
            }

            console.log("Hotels and itinerary updated successfully.");
        } catch (error) {
            console.error("Error updating hotels and itinerary:", error);
            toast.error("Error updating hotels and itinerary. Please try again.");
        }
    };


    // Return loading or error state if applicable
    if (loading) return <p>Loading trips...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {!Array.isArray(tripPhotos) || tripPhotos.length === 0 ? (
                <p className="text-slate-400">Start planning and enjoy your adventure!</p>
            ) : (
                tripPhotos.map((trip) => (
                    <div
                        className="card card-compact bg-base-100 w-[333.34px] shadow-xl"
                        key={trip.id}
                    >
                        <figure>
                            <img
                                src={trip.photoUrl}
                                alt={trip.destination}
                                className="h-[200px] w-full object-cover"
                            />
                        </figure>
                        <div className="card-body flex flex-col justify-between">
                            <div className="card-actions">
                                <div>
                                    <h2 className="card-title text2xl w-[255px]">{trip.destination}</h2>
                                    <p>
                                        {trip.days} day trip on {trip.budget} Budget for{" "}
                                        {trip.travelers}
                                    </p>
                                </div>
                                <MenuMainTrip
                                    tripId={trip.id}
                                    onEdit={() => hdlOpenModal(trip)}
                                    onClose={() => { }}
                                />
                            </div>
                            <div className="card-actions justify-end items-end">
                                <Link
                                    to={`/view-trip/${trip.id}`}
                                    className="btn rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                >
                                    See Your Plan
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
            {isModalOpen && selectedTrip && (
                <UpdateTripModel
                    isOpen={isModalOpen}
                    onClose={hdlCloseModal}
                    tripDetails={selectedTrip}
                    onUpdate={hdlUpdateTripAi}
                    actionGetUserTrips={actionGetUserTrips}
                />
            )}
        </div>
    );
};

export default UserCardMyTrip;
