// Import
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

// Import GPlace
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { googlePlaceKey }  from "@/services/gplaceService";

// Import GAI
import { createChatSession }  from "@/services/gaiService"
import AI_PROMPT from "@/components/option/AiGen";


// Import Option for Form Create Trip
import BudgetOpt from "@/components/option/BudgetOpt";
import TravelerOpt from "@/components/option/TravelerOpt";


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

    // useEffect to fetch Google Places Key
    useEffect(() => {
        const getGplaceKey = async () => {
            try {
                const key = await googlePlaceKey();
                console.log("Get Gplace key", key)
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

    // Fn for generate trip
    const generateTrip = async () => {

        // Check if the required fields are filled
        if (formData?.numberOfDays > 11 || !formData?.destination || !formData?.budget || !formData?.traveler) {
            toast.info("Please fill all details")
            return;
        }
        // console.log(formData)


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

            const jsonResponse = JSON.parse(result?.response?.text());
            console.log(JSON.stringify(jsonResponse, null, 2));

        } catch (error) {
            console.error("Error generating trip:", error);
        }
    }

    return (
        <div className="min-h-screen flex justify-center">
            <div className="w-full fixed items-center my-6 flex flex-col">
                {/* Intro */}
                <div>
                    <h2 className="text-5xl font-bold">Tell Us About Your Travel Vibe</h2>
                    <p className="py-6">
                        Fill in your preferences, and our smart planner will curate a
                        customized itinerary based on what you love.
                    </p>
                </div>

                {/* Form Create Trip */}
                <div className="m-auto border border-slate-200 rounded-lg p-8 flex flex-col gap-8 items-center">

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
                                        placeholder: "Select destination...",
                                        className: "w-80",
                                        styles: {
                                            control: (provided) => ({
                                                ...provided,
                                                height: "47.99px",
                                            }),
                                        },
                                    }}
                                />
                            ) : (
                                <p>Loading API Key...</p>
                            )}
                        </div>

                        {/* Travel Days */}
                        <div className="flex flex-row items-center gap-1">
                            <p>icon</p>
                            <input
                                type="number"
                                placeholder="How many days..."
                                className="input input-bordered w-80 h-[47.99px]"
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
                                className="select select-bordered w-80 text-base"
                                value={selectedBudget} // Set selected budget
                                onChange={(e) => {
                                    setSelectedBudget(e.target.value); // Update selected budget
                                    hdlInputChange("budget", e.target.value); // Update budget in form data
                                }}
                            >
                                <option value="" disabled className="leading-10">
                                    Select budget...
                                </option>

                                {BudgetOpt.map((item, index) => (
                                    <option key={index} value={item.title}>
                                        {item.title} ({item.description})
                                    </option>
                                ))}

                            </select>
                        </div>

                        {/* Traveler */}
                        <div className="flex flex-row items-center gap-1">
                            <p>icon</p>
                            <select
                                className="select select-bordered w-80 text-base lead"
                                value={selectedTraveler}
                                onChange={(e) => {
                                    setSelectedTraveler(e.target.value); // Update selected traveler
                                    hdlInputChange("traveler", e.target.value); // Update traveler in form data
                                }}
                            >
                                <option value="" disabled className="leading-10">
                                    How many people...
                                </option>

                                {TravelerOpt.map((item, index) => (
                                    <option key={index} value={item.people}>
                                        {item.title} ({item.people})
                                    </option>
                                ))}

                            </select>
                        </div>
                    </div>

                    {/* Button Generate Trip */}
                    <div className="my-4">
                        <button className="btn btn-neutral" onClick={generateTrip}>Generate Trip</button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default CreateTrip
