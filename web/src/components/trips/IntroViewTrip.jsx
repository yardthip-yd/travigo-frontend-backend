// Import
import React, { useEffect, useState } from "react";
import DefaultImage from "@/assets/image/pixabay.gif";

// Import component for update and delete
import MenuMainTrip from "@/components/trips/MenuMainTrip";

// Import GPlace
import { googlePlaceKey } from "@/services/GPlaceService";

// Import GPlace Photo
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GMPlaceService";

const IntroViewTrip = ({ trip }) => {

    // State for photo URL
    const [photoUrl, setPhotoUrl] = useState();

    // State for modal visibility and selected trip details
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        </div>
    );
};

export default IntroViewTrip;
