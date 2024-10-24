// Import
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotIcon } from "@/components/ui/icon";

import UpdatePlaceModal from "@/components/trips/UpdatePlaceModal";

// Import Store
import useTripStore from "@/stores/tripStore";

const MenuPlace = ({ onClose, tripId, placeId, tripDetails }) => {
    // State for open/close dropdown
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // State from Stores
    const { actionDeletePlace, actionGetUserTrips } = useTripStore();

    // Navigate
    const navigate = useNavigate();

    // Fn for toggle dropdown
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // Fn for close dropdown
    const hdlCloseDropdown = () => {
        setIsOpen(false);
        onClose();
    };

    // Fn for handle delete
    const hdlDelete = async () => {
        try {
            await actionDeletePlace(tripId, placeId);
            console.log("Hotel deleted successfully");
            await actionGetUserTrips();

            hdlCloseDropdown();
            navigate(`/view-trip/${tripId}`);
        } catch (error) {
            console.error("Error deleting hotel:", error);
        }
    };

    // Fn for handle update
    const hdlUpdate = () => {
        hdlCloseDropdown();
        setIsModalOpen(true);
    };

    return (
        <div className="dropdown dropdown-end dropdown-hover"
            onMouseEnter={toggleDropdown}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div tabIndex={0} role="button">
                <DotIcon className="w-6 cursor-pointer" />
            </div>
            {isOpen && (
                <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-50 w-40 shadow text-center"
                >
                    <li>
                        <a onClick={hdlUpdate}>Change Time</a>
                    </li>
                    <li>
                        <a onClick={hdlDelete}>Delete Itinerary</a>
                    </li>
                    <li>
                        <a onClick={hdlCloseDropdown}>Close</a>
                    </li>
                </ul>
            )}
            {isModalOpen && (
                <UpdatePlaceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    tripDetails={tripDetails} 
                    onUpdate={(updatedData) => {
                        console.log("Updated data:", updatedData);
                    }}
                />
            )}
        </div>
    );
}

export default MenuPlace;
