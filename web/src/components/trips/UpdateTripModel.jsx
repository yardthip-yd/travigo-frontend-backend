// Import
import React, { useState } from 'react';

// Import Option for Form Create Trip
import BudgetOpt from "@/components/options/BudgetOpt";
import TravelerOpt from "@/components/options/TravelerOpt";

const UpdateTripModel = ({ isOpen, onClose, tripDetails, onUpdate }) => {

    // useState for update generate trip
    const [traveler, setTraveler] = useState(tripDetails.travelers);
    const [budget, setBudget] = useState(tripDetails.budget);
    const [numberOfDays, setNumberOfDays] = useState(tripDetails.days);

    // Fn for update trip
    const hdlUpdateTrip = (e) => {
        e.preventDefault();
        const updatedTrip = {
            destination: tripDetails.destination,
            travelers: traveler,
            budget,
            days: Number(numberOfDays),
        };
        onUpdate(updatedTrip);
        onClose();
    };

    if (!isOpen) return null; // Don't render if not open


    return (
        <div className="modal modal-open items-start">
            <div className="modal-box">
                <h2 className="font-bold text-xl mb-4">Update Trip Details</h2>
                <div className="form-control">
                    <label className="label font-semibold">Destination</label>
                    <input
                        type="text"
                        value={tripDetails.destination}
                        readOnly
                        className="input input-bordered bg-gray-100 text-gray-600"
                        style={{ pointerEvents: 'none' }} // Disable interactions
                    />
                </div>
                <form onSubmit={hdlUpdateTrip}>
                    <div className="form-control">
                        <label className="label font-semibold">Days</label>
                        <input
                            type="number"
                            value={numberOfDays}
                            placeholder="How many days..."
                            onChange={(e) => setNumberOfDays(e.target.value)}
                            className="input input-bordered placeholder:text-slate-900"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label font-semibold">Budget</label>
                        <select
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="select select-bordered"
                            required
                        >
                            <option value="" disabled>Select budget...</option>
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
                            value={traveler}
                            onChange={(e) => setTraveler(e.target.value)}
                            className="select select-bordered"
                            required
                        >
                            <option value="" disabled>How many people...</option>
                            {TravelerOpt.map((item, index) => (
                                <option key={index} value={item.title}>
                                    {item.title} ({item.people})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-action">
                        <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            Update Plan
                        </button>
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateTripModel