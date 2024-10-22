// Import
import React, { useEffect, useState } from "react";
import DefaultImage from "@/assets/image/pixabay.jpg";
import MenuMainTrip from "@/components/trips/MenuMainTrip";
import { Link } from "react-router-dom";

// Import Store
import useTripStore from "@/stores/tripStore";

// Import GPlace
import { googlePlaceKey } from "@/services/GPlaceService";

// Import GPlace Photo
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GMPlaceService";

const UserCardMyTrip = () => {
    // State from Stores
    const { trips, actionGetUserTrips, loading, error } = useTripStore();

    // State for storing trip photo URLs
    const [tripPhotos, setTripPhotos] = useState({});

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

    // Return loading or error state if applicable
    if (loading) return <p>Loading trips...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {!Array.isArray(tripPhotos) || tripPhotos.length === 0 ? (
                <p>No trips available.</p> 
            ) : (
                tripPhotos.map((trip) => (
                        <div
                            className="card card-compact bg-base-100 w-full shadow-xl"
                            key={trip.id}
                        >
                            <figure>
                                <img
                                    src={trip.photoUrl}
                                    alt={trip.destination}
                                    className="h-[200px] w-full object-cover"
                                />
                            </figure>
                            <div className="card-body flex flex-col">
                                <div className="card-actions">
                                    <div>
                                        <h2 className="card-title text2xl">{trip.destination}</h2>
                                        <p>
                                            {trip.days} day trip on {trip.budget} Budget for{" "}
                                            {trip.travelers}
                                        </p>
                                    </div>
                                    <MenuMainTrip
                                        tripId={trip.id}
                                        onEdit={() => console.log("Edit Plan")}
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
                    )
                )
            )}
        </div>
    );
};

export default UserCardMyTrip;
