// Import
import React, { useEffect, useState } from "react";
import DefaultImage from "@/assets/image/pixabay.gif";
import { toast } from 'react-toastify';
import axios from "axios"

// Import component for update and delete
import MenuMainTrip from "@/components/trips/MenuMainTrip";
import UpdateTripModel from "@/components/trips/UpdateTripModel";

// Import GPlace
import { googlePlaceKey } from "@/services/GPlaceService";

// Import GPlace Photo
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GMPlaceService";

// Import GAI
import { createChatSession } from "@/services/GAiService"
import AI_PROMPT from "@/components/options/AiGen";

// Import Store
import useTripStore from "@/stores/tripStore";

const IntroViewTrip = ({ trip }) => {

    // State from Stores
    const { trips, actionGetUserTrips, actionUpdateTrip } = useTripStore();

    // State for photo URL
    const [photoUrl, setPhotoUrl] = useState();

    // State for modal visibility and selected trip details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    // useEffect for fetch place photo based on trip details
    useEffect(() => {
        if (trip) {
            GetPlacePhoto();
        }
    }, [trip]);

    // Fn for get place photo
    const GetPlacePhoto = async () => {
        const data = {
            textQuery: trip?.destination,
        };
        // console.log("Trip data", trip);

        try {
            const result = await GetPlaceDetails(data);
            // console.log("Result data", result.data);
            // console.log("Result data", result.data.places[0].photos[3].name);

            const apiKey = await googlePlaceKey();

            const photoName = result.data.places[0]?.photos[0]?.name;
            // console.log("Photo Name", photoName)

            if (photoName) {
                const newPhotoUrl = PHOTO_REF_URL(photoName, apiKey);
                setPhotoUrl(newPhotoUrl);
            } else {
                console.error("No photos found for the location.");
            }
        } catch (error) {
            console.error("Error fetching place photo:", error);
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

        if (!selectedTrip) {
            toast.error("No trip selected for update.");
            return;
        }

        const FINAL_PROMPT = AI_PROMPT
            .replace("{destination}", updatedData.destination.trim())
            .replace("{totalDays}", updatedData.days)
            .replace("{traveler}", updatedData.travelers.trim())
            .replace("{budget}", updatedData.budget.trim());

        try {
            const chatSession = await createChatSession();
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            // console.log("Raw response from AI:", result.response.text);

            let jsonResponse;

            try {
                jsonResponse = JSON.parse(result?.response?.text());
            } catch (parseError) {
                console.error("JSON parsing error:", parseError);
                console.error("Response text that caused the error:", result.response.text);
                toast.error("Error parsing AI response. Please try again.");
                return;
            }

            console.log("JSON Response from AI from Intro Trip", jsonResponse);


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


    return (
        <div className="bg-white rounded-xl shadow-xl w-[1080px]">
            <img
                src={photoUrl || DefaultImage}
                className="min-w-[1080px] h-[300px] rounded-xl shadow-xl object-cover"
            ></img>
            <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between">
                    <p className="font-bold text-2xl">{trip.destination}</p>
                    <MenuMainTrip
                        tripId={trip.id}
                        onEdit={hdlOpenModal}
                        onClose={() => { }}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="badge bg-blue-100 font-semibold px-4">
                        {trip.budget} Budget
                    </div>
                    <div className="badge bg-blue-100 font-semibold px-4">
                        {trip.travelers}
                    </div>
                    <div className="badge bg-blue-100 font-semibold px-4">
                        {trip.days} Day
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <UpdateTripModel
                    isOpen={isModalOpen}
                    onClose={hdlCloseModal}
                    tripDetails={trip}
                    onUpdate={hdlUpdateTripAi}
                />
            )}
        </div>
    );
};

export default IntroViewTrip;
