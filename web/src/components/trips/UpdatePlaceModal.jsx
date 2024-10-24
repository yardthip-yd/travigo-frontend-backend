// Import
import React, { useState } from 'react'

// Import Store
import useTripStore from "@/stores/tripStore";

const UpdatePlaceModal = ({ isOpen, onClose, tripDetails, onUpdate }) => {

    // State for holding new times
    const [startTime, setStartTime] = useState(tripDetails.startTime);
    const [endTime, setEndTime] = useState(tripDetails.endTime);

    const { actionUpdateItineraryTime } = useTripStore();

    // Fn for update trip
    const hdlUpdatePlace = async (e) => {
        e.preventDefault();
        const updatedPlace = {
            ...tripDetails,
            startTime,
            endTime,
        };

        try {
            await actionUpdateItineraryTime(updatedPlace.tripId, updatedPlace.id, {
                startTime: updatedPlace.startTime,
                endTime: updatedPlace.endTime,
            });
            onUpdate(updatedPlace);
            onClose();
        } catch (error) {
            console.error("Error updating itinerary time:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open flex justify-center mt-80">
            <div className="modal-box w-[400px]">
                <h2 className="font-bold text-xl mb-4">Update Trip Details</h2>
                <form onSubmit={hdlUpdatePlace}>
                    <div className="form-control">
                        <label className="label font-semibold">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="input input-bordered w-full bg-slate-50 border-none"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label font-semibold">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="input input-bordered w-full bg-slate-50 border-none"
                            required
                        />
                    </div>
                    <div className="modal-action">
                        <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            Update Time
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

export default UpdatePlaceModal