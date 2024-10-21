// Import
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

// Import GPlace
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { googlePlaceKey } from "@/services/GPlaceService";

// Import GAI
import { createChatSession } from "@/services/GAiService"
import AI_PROMPT from "@/components/options/AiGen";

// Import Option for Form Create Trip
import BudgetOpt from "@/components/options/BudgetOpt";
import TravelerOpt from "@/components/options/TravelerOpt";

// Import VDO
import Mainvdo from "@/assets/video/main.mp4"
import { DropdownIcon } from "@/components/ui/icon";

// Import store
import useAuthStore from "@/stores/authStore";
import useTripStore from "@/stores/tripStore";

const CreateTrip = () => {

    // useState for store the Gplace Key as API key
    const [apiKey, setApiKey] = useState("");

    // useState for store selected Destination/Place
    const [place, setPlace] = useState();

    // useState for store Form Data
    const [formData, setFormData] = useState({});

    // useState for store selected Budget option
    const [selectedBudget, setSelectedBudget] = useState("");

    // useState for store selected Traveler option
    const [selectedTraveler, setSelectedTraveler] = useState("");

    // State from Stores
    const user = useAuthStore((state) => state.user)

    // Fetch createTrip from tripStore
    const createTrip = useTripStore((state) => state.createTrip);

    // Navigate
    const navigate = useNavigate();

    // useEffect to fetch Google Places Key
    useEffect(() => {
        const getGplaceKey = async () => {
            try {
                const key = await googlePlaceKey();
                // console.log("Get Gplace key", key)
                setApiKey(key);

            } catch (error) {
                console.error("Error getting GPlace Key:", error);
            }
        };

        getGplaceKey();
    }, []);

    // useEffect for update Form Data whenever it changes
    useEffect(() => {
        console.log(formData);
    }, [formData]);

    // Fn handleInputChange update Form Data when user select destination, days, budget, traveler
    const hdlInputChange = (name, value) => {
        setFormData({
            ...formData,
            // destination: value,
            [name]: value,
        });
    };

    // Fn for generate trip from AI
    const generateTrip = async () => {

        // Check if the required fields are filled
        if (formData?.numberOfDays > 11 || !formData?.destination || !formData?.budget || !formData?.traveler) {
            toast.info("Please fill all details")
            return;
        }
        console.log("Form data", formData)


        // Construct the prompt for the AI model
        const FINAL_PROMPT = AI_PROMPT
            .replace("{destination}", formData?.destination.label)
            .replace("{totalDays}", formData?.numberOfDays)
            .replace("{traveler}", formData?.traveler)
            .replace("{budget}", formData?.budget)
        // console.log(FINAL_PROMPT)

        try {

            // Create a chat session & Send message to AI
            const chatSession = await createChatSession();
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            // console.log(result?.response?.text());

            // Log to see trip data
            const jsonResponse = JSON.parse(result?.response?.text());
            // console.log(JSON.stringify(jsonResponse, null, 2));

            // Log AI response
            console.log("JSON Response from AI:", jsonResponse);

            // Save trip data to the database
            await saveTripToDatabase(jsonResponse);

        } catch (error) {
            console.error("Error generating trip:", error);
        }
    }

    // Fn to save trip data to the database
    const saveTripToDatabase = async (jsonResponse) => {
        try {
            const userId = user.id;
            // console.log("User ID:", userId);

            const tripData = {
                destination: place?.label,
                budget: selectedBudget,
                travelers: selectedTraveler,
                days: parseInt(formData.numberOfDays, 10),
                userId: userId, // user ID from Zustand
                jsonResponse, // Send AI response for hotels and itinerary
            };
            console.log("Trip Data to save:", tripData)

            const response = await createTrip(tripData)
            console.log("Trip created:", response);

            toast.success("Trip created successfully!");

            // // Redirect to the view trip page with the tripId
            // navigate(`/view-trip/${response.id}`);
            navigate(`/view-trip/${response.result.id}`);

        } catch (error) {
            console.error("Error creating trip:", error);
            toast.error("Error creating trip. Please try again."); // Notify user of failure
        }
    };

    return (
        <div className="h-screen w-full flex items-center min-h-[500px]">
            {/* Background */}
            <div>
                <video
                    className="absolute right-0 top-0 h-screen w-full object-cover z-[-1]"
                    src={Mainvdo}
                    autoPlay
                    loop
                    muted
                >
                </video>
                {/* Black Overlay */}
                <div className="absolute h-screen inset-0 bg-black opacity-40 z-[-1]"></div>
            </div>

            {/* Information */}
            <div className="w-full fixed my-[130px] flex flex-col items-center">

                <div className="flex flex-col text-start">

                    {/* Intro */}
                    <div className="text-white">
                        <h2 className="text-5xl font-bold" data-aos="fade-up">Tell Us About Your Travel Vibe</h2>
                        <p className="py-6" data-aos="fade-up" data-aos-deley="300" >
                            Fill in your preferences, and our smart planner will curate a
                            customized itinerary based on what you love.
                        </p>
                    </div>

                    {/* Form Create Trip */}
                    <div className="m-auto border border-slate-200 rounded-xl p-8 flex flex-col gap-8 items-center bg-white bg-opacity-90 relative drop-shadow-2xl shadow-2xl pb-12" data-aos="fade-up" data-aos-deley="300">

                        {/* First Row */}
                        <div className="flex flex-row gap-4">

                            {/* Destination */}
                            <div className="flex flex-row items-center gap-1">
                                <p>icon</p>

                                {apiKey ? (
                                    <GooglePlacesAutocomplete
                                        apiKey={apiKey} // Use the fetched API Key
                                        selectProps={{
                                            place,
                                            onChange: (placeData) => {
                                                setPlace(placeData); // Update selected place
                                                hdlInputChange("destination", placeData); // Update destination in form data
                                            },
                                            placeholder: "Search your destination...",
                                            className: "w-80 bg-slate-50 border-slate-200 rounded-full",
                                            styles: {
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: "47.99px",
                                                    border: "1px #e2e8f0",
                                                    borderRadius: "0.5rem",
                                                    backgroundColor: "##f8fafc"
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    color: '#0f172a',
                                                    paddingLeft: '8px',
                                                }),
                                                indicatorSeparator: () => ({
                                                    display: 'none',
                                                }),
                                                dropdownIndicator: (provided) => ({
                                                    ...provided,
                                                    padding: 0,
                                                    width: "6px",
                                                    height: "6px",
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#4A5568',
                                                }),
                                            },
                                            components: {
                                                DropdownIndicator: () => (
                                                    <div className="flex items-center justify-center">
                                                        <DropdownIcon className="text-gray-600" />
                                                    </div>
                                                ),
                                            },
                                        }}
                                    />
                                ) : (
                                    <p className="w-80 text-base bg-slate-50 border border-slate-200 text-slate-400">Loading API Key...</p>
                                )}
                            </div>

                            {/* Travel Days */}
                            <div className="flex flex-row items-center gap-1">
                                <p>icon</p>
                                <input
                                    type="number"
                                    placeholder="How many days..."
                                    className="input input-bordered w-80 h-[47.99px] bg-slate-50 border-slate-200 rounded-full placeholder:text-slate-900"
                                    onChange={(e) => hdlInputChange("numberOfDays", e.target.value)} // Update number of days in form data
                                />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="flex flex-row gap-4">

                            {/* Budget */}
                            <div className="flex flex-row items-center gap-1">
                                <p>icon</p>
                                <select
                                    className="select select-bordered w-80 text-base bg-slate-50 border-slate-200 rounded-full text-slate-900"
                                    value={selectedBudget} // Set selected budget
                                    onChange={(e) => {
                                        setSelectedBudget(e.target.value); // Update selected budget
                                        hdlInputChange("budget", e.target.value); // Update budget in form data
                                    }}
                                >
                                    <option value="" disabled className="leading-10  text-slate-400">
                                        Select budget...
                                    </option>

                                    {BudgetOpt.map((item, index) => (
                                        <option key={index} value={item.title}>
                                            {item.title} 
                                            {/* ({item.description}) */}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            {/* Traveler */}
                            <div className="flex flex-row items-center gap-1">
                                <p>icon</p>
                                <select
                                    className="select select-bordered w-80 text-base bg-slate-50 border-slate-200 rounded-full select-custom text-slate-900"
                                    value={selectedTraveler}
                                    onChange={(e) => {
                                        setSelectedTraveler(e.target.value); // Update selected traveler
                                        hdlInputChange("traveler", e.target.value); // Update traveler in form data
                                    }}
                                >
                                    <option value="" disabled className="leading-10 text-slate-400">
                                        How many people...
                                    </option>

                                    {TravelerOpt.map((item, index) => (
                                        <option key={index} value={item.title}>
                                            {item.title} ({item.people})
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Button Generate Trip */}
                <div className="my-4 drop-shadow-2xl shadow-2xl absolute left-1/2 transform -translate-x-1/2 top-[calc(100%-40px)]">
                    <button className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-40 border-none" onClick={generateTrip}>Generate Trip</button>
                </div>
            </div>
        </div>
    )
}

export default CreateTrip