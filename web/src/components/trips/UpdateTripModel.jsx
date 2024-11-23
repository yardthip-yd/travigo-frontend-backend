// Import
import React, { useState } from "react";

// Import Option for Form Create Trip
import BudgetOpt from "@/components/options/BudgetOpt";
import TravelerOpt from "@/components/options/TravelerOpt";

// Import Store
import useTripStore from "@/stores/tripStore";

const UpdateTripModel = ({ tripId, existingTrip, onClose }) => {
    const { actionUpdateTrip } = useTripStore();

    // useState for update generate trip
    const [days, setDays] = useState(existingTrip.days);
    const [budget, setBudget] = useState(existingTrip.budget);
    const [travelers, setTravelers] = useState(existingTrip.travelers);

    // Fn for update trip
    const hdlUpdate = async () => {
        try {
            // Gather all required fields for the update request
            const updatedData = {
                destination: existingTrip.destination,
                days,
                budget,
                travelers,
            };

            console.log("Update Trip Input Data: from trip modal", updatedData);
    
            await actionUpdateTrip(tripId, updatedData);
            onClose(); // Close the modal after a successful update
        } catch (error) {
            console.error("Failed to update trip:", error);
        }
    };

    return (
        <div className="modal modal-open items-start">
            <div className="modal-box">
                <h2 className="font-bold text-xl mb-4">Update Trip Details</h2>
                <div className="form-control">
                    <label className="label font-semibold">Destination</label>
                    <input
                        type="text"
                        value={existingTrip.destination} 
                        readOnly
                        className="input input-bordered bg-gray-100 text-gray-600"
                        style={{ pointerEvents: "none" }} // Disable interactions
                    />
                </div>
                <form onSubmit={hdlUpdate}>
                    <div className="form-control">
                        <label className="label font-semibold">Days</label>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="input input-bordered border-slate-200 placeholder:text-slate-400"
                            placeholder="How many days..."
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label font-semibold">Budget</label>
                        <select
                            type="text"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="select select-bordered"
                            required
                        >
                            <option value="" disabled>
                                Select budget...
                            </option>
                            {BudgetOpt.map((item, index) => (
                                <option key={index} value={item.title}>
                                    {item.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label font-semibold">Travelers</label>
                        <select
                            type="number"
                            value={travelers}
                            onChange={(e) => setTravelers(e.target.value)}
                            className="select select-bordered"
                            required
                        >
                            <option value="" disabled>
                                How many people...
                            </option>
                            {TravelerOpt.map((item, index) => (
                                <option key={index} value={item.title}>
                                    {item.title} ({item.people})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-action">
                        <button
                            type="submit"
                            className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            onClick={hdlUpdate}
                        >
                            Update Plan
                        </button>
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTripModel;
