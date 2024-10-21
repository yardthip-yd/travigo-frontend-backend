// Import
import React, { useEffect, useState } from "react";

// Import VDO
import Mainvdo from "@/assets/video/main.mp4";
import DefaultImage from "@/assets/image/pixabay.jpg";

// Import store
import useTripStore from "@/stores/tripStore";
import { useParams } from "react-router-dom";
import { DotIcon, PlaceIcon } from "@/components/ui/icon";

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
                        <div className="p-2 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <p className="font-bold text-2xl">
                                    {trip.destination}
                                </p>

                                <div className="dropdown dropdown-end dropdown-hover">
                                    <div tabIndex={0} role="button">
                                        <DotIcon className="w-6 cursor-pointer" />
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-center">
                                        <li><a>Edit Plan</a></li>
                                        <li><a>Delete Plan</a></li>
                                        <li><a onClick={() => console.log('Close')}>Close</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="badge bg-blue-100 font-semibold px-4">{trip.budget} Budget</div>
                                <div className="badge bg-blue-100 font-semibold px-4">{trip.travelers}</div>
                                <div className="badge bg-blue-100 font-semibold px-4">{trip.days} Day</div>
                            </div>
                        </div>
                    </div>
                    {/* Map */}

                    {/* Recommend Hotels */}
                    <div className="bg-white rounded-xl shadow-xl w-[1080px] p-2 flex flex-col gap-2">
                        <h2 className="font-bold text-xl">Hotel Recommendations</h2>

                        {/* Hotel Information */}
                        <div className="flex space-x-8 my-5">
                            {trip.Hotel.map((hotel) => (
                                <div key={hotel.id} className="card bg-base-100 shadow-xl w-80 flex-shrink-0 hover:scale-110 transition-all">
                                    <figure>
                                        <img src={hotel.hotelImageUrl} alt={hotel.hotelName} />
                                    </figure>
                                    <div className="card-body">
                                        <h2>{hotel.hotelName}</h2>
                                        <p>Address: {hotel.hotelAddress}</p>
                                        <p>Price: THB {hotel.hotelPrice} per day</p>

                                        {/* Display half star rating */}
                                        <div className="items-center flex gap-2">
                                            <div className="rating rating-sm rating-half">
                                                {/* <input type="radio" name={`rating-${hotel.id}`} className="rating-hidden" /> */}
                                                {Array.from({ length: 5 }, (_, index) => {
                                                    const fullStar = index + 1;
                                                    const halfStar = index + 0.5;
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <input
                                                                type="radio"
                                                                name={`rating-${hotel.id}`}
                                                                className="mask mask-star-2 mask-half-1 bg-blue-500"
                                                                defaultChecked={hotel.hotelRating === halfStar || hotel.hotelRating === fullStar}
                                                                disabled
                                                            />
                                                            <input
                                                                type="radio"
                                                                name={`rating-${hotel.id}`}
                                                                className="mask mask-star-2 mask-half-2 bg-blue-500"
                                                                defaultChecked={hotel.hotelRating === fullStar}
                                                                disabled
                                                            />
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                            <p>{hotel.hotelRating} Stars</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Daily Itinerary */}
                    <div className="bg-white rounded-xl shadow-xl w-[1080px] p-2 flex flex-col gap-2">
                        <h2 className="font-bold text-xl">Places to Visit</h2>

                        {/* Itinerary Information */}
                        <div className="flex flex-col">
                            {trip.Itinerary.map((itinerary) => (
                                <div key={itinerary.id} className="flex items-start mb-4">
                                    <PlaceIcon className="w-8 h-8 mr-4" />

                                    <div className="flex-grow border-b-2 border-b-slate-300">
                                        <p>Day: {itinerary.day}</p>
                                        <h3 className="font-semibold">{itinerary.placeName}</h3>
                                        <p>{itinerary.placeDescription}</p>
                                        <p>Best Time to Visit: {itinerary.bestTimeToVisit}</p>
                                        <p>Ticket Price: THB {itinerary.ticketPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTrip;
