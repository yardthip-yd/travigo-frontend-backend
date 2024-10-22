// Import
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Import VDO
import Mainvdo from "@/assets/video/main.mp4";

// Import store
import useTripStore from "@/stores/tripStore";

// Import Component
import IntroViewTrip from "@/components/trips/IntroViewTrip";
import HotelRecViewTrip from "@/components/trips/HotelRecViewTrip";
import ItineraryViewTrip from "@/components/trips/ItineraryViewTrip";

const ViewTrip = () => {
    // State from Stores
    const viewTrip = useTripStore((state) => state.viewTrip);

    // useState for store trip details
    const [trip, setTrip] = useState(null);

    // State for photo URL
    const [photoUrl, setPhotoUrl] = useState();

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
                    <IntroViewTrip trip={trip} />
                    <HotelRecViewTrip trip={trip} hotels={trip.Hotel}/>
                    <ItineraryViewTrip trip={trip} itineraries={trip.Itinerary} />
                </div>
            </div>
        </div>
    );
};

export default ViewTrip;
