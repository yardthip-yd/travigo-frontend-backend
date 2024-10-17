// Import
import React, { useEffect, useState } from "react";

// Import VDO
import Mainvdo from "@/assets/video/main.mp4";
import DefaultImage from "@/assets/image/pixabay.jpg";

// Import store
import useTripStore from "@/stores/tripStore";
import { useParams } from "react-router-dom";

const ViewTrip = () => {
    // State from Stores
    const viewTrip = useTripStore((state) => state.viewTrip);

    // useState for store trip details
    const [trip, setTrip] = useState(null);

    // useParams for extract tripId
    const { tripId } = useParams();

    // useEffect for fetch view trip
    useEffect(() => {
        const getTrip = async () => {
            try {
                const tripData = await viewTrip(tripId);
                setTrip(tripData.trip); // Set the trip state with the retrieved trip details
            } catch (error) {
                console.error("Error fetching trip details:", error);
            }
        };

        getTrip();
    }, [tripId, viewTrip]); // Dependency array includes tripId and viewTrip to rerun the effect if they change

    // Display loading message while the trip details are being fetched
    if (!trip) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen w-full flex items-start min-h-[500px] overflow-auto">
            {/* Background */}
            <div>
                <video
                    className="absolute right-0 top-0 h-screen w-full object-cover z-[-1]"
                    src={Mainvdo}
                    autoPlay
                    loop
                    muted
                ></video>
                {/* Black Overlay */}
                <div className="absolute h-screen inset-0 bg-black opacity-60 z-[-1]"></div>
            </div>

            <div className="w-full flex-grow my-[30px] flex flex-col items-start">
                <div className="m-auto rounded-xl p-4 flex flex-col gap-4 items-center bg-white bg-opacity-90 relative drop-shadow-2xl shadow-2xl">
                    {/* Information */}
                    <div className="bg-white rounded-xl shadow-xl w-[1080px]">
                        <img
                            src={DefaultImage}
                            className="min-w-[1080px] h-[300px] rounded-xl shadow-xl object-cover"
                        ></img>
                        <div className="p-2">
                            <div className="flex justify-between">
                                <p className="font-bold text-2xl">
                                    {trip.destination}
                                </p>
                                <p className="font-bold text-2xl">...</p>
                            </div>
                            <div>
                                <p>Budget: {trip.budget}</p>
                                <p>Travelers: {trip.travelers}</p>
                                <p>Days: {trip.days}</p>
                            </div>
                        </div>
                    </div>
                    {/* Map */}

                    {/* Recommend Hotels */}
                    <div className="bg-white rounded-xl shadow-xl w-[1080px] p-2">
                        <h2>Hotel Recommendations</h2>
                        {trip.Hotel.map((hotel) => (
                            <div key={hotel.id}>
                                <h3>{hotel.hotelName}</h3>
                                <p>{hotel.hotelDescription}</p>
                                <p>Price: THB {hotel.hotelPrice}</p>
                                <img src={hotel.hotelImageUrl} alt={hotel.hotelName} />
                            </div>
                        ))}
                    </div>

                    {/* Daily Itinerary */}
                    <div className="bg-white rounded-xl shadow-xl w-[1080px] p-2">
                        <h2>Places to Visit</h2>
                        {trip.Itinerary.map((itinerary) => (
                            <div key={itinerary.id}>
                                <h3>{itinerary.day}</h3>
                                <h3>{itinerary.placeName}</h3>
                                <p>{itinerary.placeDescription}</p>
                                <p>Best Time to Visit: {itinerary.bestTimeToVisit}</p>
                                <p>Ticket Price: THB {itinerary.ticketPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTrip;
