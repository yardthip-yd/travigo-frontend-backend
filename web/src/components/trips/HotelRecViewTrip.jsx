// Import
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DefaultImage from "@/assets/image/pixabay.gif";
import useTripStore from "@/stores/tripStore";

// Import GPlace
import { googlePlaceKey } from "@/services/GPlaceService";

// Import GPlace Photo
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GMPlaceService";

// Import Icon
import { MapIcon } from "@/components/ui/icon";
import MenuHotel from "@/components/trips/MenuHotel";

const HotelRecViewTrip = ({ trip, hotels }) => {

    const { trips, actionGetUserTrips } = useTripStore();

    // State for photo URL
    const [hotelPhotos, setHotelPhotos] = useState({});

    // // useEffect for fetch hotel photo based on trip details
    useEffect(() => {
        const fetchHotelPhotos = async () => {
            if (trip && trip.Hotel) {
                const hotelsWithPhotos = await Promise.all(trip.Hotel.map(async (hotel) => {
                    const photoUrl = await GetHotelPhotos(hotel);
                    return { ...hotel, photoUrl };
                }));

                // Set the hotel photos in state
                setHotelPhotos(hotelsWithPhotos.reduce((acc, hotel) => {
                    acc[hotel.id] = hotel.photoUrl; // เก็บ photoUrl ตาม hotel.id
                    return acc;
                }, {}));
            }
        };
        fetchHotelPhotos();
    }, [trip]);

    useEffect(() => {
        const fetchTrips = async () => {
            await actionGetUserTrips();
        };

        fetchTrips();
    }, [actionGetUserTrips]);

    // Fn for get hotel photo 
    const GetHotelPhotos = async (hotel) => {
        const data = {
            textQuery: hotel.hotelName,
        };
        // console.log("Trip data", trip);

        try {
            const result = await GetPlaceDetails(data);
            // console.log("Result data", result.data);
            const apiKey = await googlePlaceKey();

            if (result.data.places && result.data.places.length > 0 && result.data.places[0].photos) {
                const photoName = result.data.places[0].photos[0]?.name;

                if (photoName) {
                    return PHOTO_REF_URL(photoName, apiKey);
                }
            }
        } catch (error) {
            console.error("Error fetching hotel photo:", error);
        }
        return DefaultImage;
    };

    return (
        <div className="bg-white rounded-xl shadow-xl w-[1080px] p-2 flex flex-col gap-2">
            <h2 className="font-bold text-xl">Hotel Recommendations</h2>
            <div className="flex space-x-8 overflow-auto py-4">
                {hotels.map((hotel) => (
                    <div key={hotel.id} className="card card-compact bg-base-100 shadow-xl w-80 flex-shrink-0 hover:scale-105 transition-all">
                        <Link
                            key={hotel.id}
                            to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName}`}
                            target="_blank"
                        >
                            <img src={hotelPhotos[hotel.id] || DefaultImage} className="h-[200px] w-full object-cover rounded-xl" />
                        </Link>
                        <div className="card-body  min-h-[190px]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold">{hotel.hotelName}</h2>
                                <MenuHotel tripId={trip.id} hotelId={hotel.id} onClose={() => { }} />
                            </div>
                            <p>Address: {hotel.hotelAddress}</p>
                            <p>Price: THB {hotel.hotelPrice} per day</p>
                            <div className="flex justify-between">
                                {/* Star */}
                                <div className="items-center flex gap-2">
                                    <div className="rating rating-sm rating-half">
                                        {Array.from({ length: 5 }, (_, index) => {
                                            const fullStar = index + 1;
                                            const halfStar = index + 0.5;
                                            return (
                                                <React.Fragment key={index}>
                                                    <input
                                                        type="radio"
                                                        name={`rating-${hotel.id}`}
                                                        className="mask mask-star-2 mask-half-1 bg-blue-500"
                                                        defaultChecked={
                                                            hotel.hotelRating === halfStar ||
                                                            hotel.hotelRating === fullStar
                                                        }
                                                        disabled
                                                    />
                                                    <input
                                                        type="radio"
                                                        name={`rating-${hotel.id}`}
                                                        className="mask mask-star-2 mask-half-2 bg-blue-500"
                                                        defaultChecked={
                                                            hotel.hotelRating === fullStar
                                                        }
                                                        disabled
                                                    />
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                    <p>{hotel.hotelRating} Stars</p>
                                </div>
                                {/* Map */}
                                <Link
                                    key={hotel.id}
                                    to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName}`}
                                    target="_blank"
                                >
                                    <MapIcon className="h-10 w-10" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HotelRecViewTrip
