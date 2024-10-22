// Import
import React, { useEffect, useState } from "react";
import DefaultImage from "@/assets/image/pixabay.jpg";

// Import GPlace
import { googlePlaceKey } from "@/services/GPlaceService";

// Import GPlace Photo
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GMPlaceService";

const ItineraryViewTrip = ({ trip, itineraries }) => {
    // State for photo URLs
    const [itineraryPhotos, setItineraryPhotos] = useState({});

    // useEffect for fetch place photo based on trip details
    useEffect(() => {
        const fetchItineraryPhotos = async () => {
            if (trip && itineraries) {
                const itinerariesWithPhotos = await Promise.all(itineraries.map(async (itinerary) => {
                    const photoUrl = await GetItineraryPhotos(itinerary);
                    return { ...itinerary, photoUrl }; 
                }));

                // Set the itinerary photos in state
                setItineraryPhotos(itinerariesWithPhotos.reduce((acc, itinerary) => {
                    acc[itinerary.id] = itinerary.photoUrl;
                    return acc;
                }, {}));
            }
        };
        fetchItineraryPhotos();
    }, [trip, itineraries]);

    // Fn for get itinerary photo 
    const GetItineraryPhotos = async (itinerary) => {
        const data = {
            textQuery: itinerary.placeName,
        };

        try {
            const result = await GetPlaceDetails(data);
            // console.log("Result data", result.data);
            const apiKey = await googlePlaceKey();
            const photoName = result.data.places[0]?.photos[0]?.name;

            if (photoName) {
                return PHOTO_REF_URL(photoName, apiKey);
            }
        } catch (error) {
            console.error("Error fetching itinerary photo:", error);
        }
        return DefaultImage;
    };

    return (
        <div className="bg-white rounded-xl shadow-xl w-[1080px] p-2 flex flex-col gap-2">
            <h2 className="font-bold text-xl">Places to Visit</h2>
            <div className="flex flex-col">
                {itineraries.reduce((acc, itinerary) => {
                    const dayGroup = acc.find(item => item.day === itinerary.day);
                    if (!dayGroup) {
                        acc.push({
                            day: itinerary.day,
                            places: [itinerary],
                        });
                    } else {
                        dayGroup.places.push(itinerary);
                    }
                    return acc;
                }, []).map((group) => (
                    <div key={group.day} className="my-2">
                        <p className="font-semibold mb-2 p-4">Day {group.day}</p>
                        {group.places.map((itinerary) => (
                            <div key={itinerary.id} className="flex items-start mb-4 rounded-2xl shadow-xl">
                                <div className="flex-grow flex gap-2">
                                    <img
                                        src={itineraryPhotos[itinerary.id]}
                                        alt={itinerary.placeName}
                                        className="h-48 rounded-2xl min-w-80 max-w-80 object-cover"
                                    />
                                    <div className="px-8 m-auto flex flex-col gap-2">
                                        <p className="text-blue-500 font-semibold">{itinerary.startTime} - {itinerary.endTime}</p>
                                        <h3 className="font-bold">{itinerary.placeName}</h3>
                                        <p>{itinerary.placeDescription}</p>
                                        <p>Ticket Price: THB {itinerary.ticketPrice}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ItineraryViewTrip

