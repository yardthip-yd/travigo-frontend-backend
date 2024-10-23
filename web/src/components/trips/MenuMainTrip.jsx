// Import
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { DotIcon } from "@/components/ui/icon";

// Import Store
import useTripStore from "@/stores/tripStore";

// Impot Model
import UpdateTripModal from "@/components/trips/UpdateTripModel"

const MenuMainTrip = ({ onEdit, onClose, tripId, tripDetails }) => {

    // State for open/close dropdown
    const [isOpen, setIsOpen] = useState(false);

    // State from Stores
    const { actionDeleteTrip } = useTripStore();

    // State from modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            await actionDeleteTrip(tripId);
            console.log("Trip deleted successfully");
            hdlCloseDropdown();
            navigate('/my-trip')
        } catch (error) {
            console.error("Error deleting trip:", error);
        }
    };

    // Fn for handle update
    const hdlUpdate = () => {
        hdlCloseDropdown();
        onEdit(tripDetails);
    };

    return (
        <div className="dropdown dropdown-end dropdown-hover"
            onMouseEnter={toggleDropdown}
            // onMouseLeave={toggleDropdown}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div tabIndex={0} role="button">
                <DotIcon className="w-6 cursor-pointer" />
            </div>
            {isOpen && (
                <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 shadow text-center"
                >
                    <li>
                        <a onClick={hdlUpdate}>Update Plan</a>
                    </li>
                    <li>
                        <a onClick={hdlDelete}>Delete Plan</a>
                    </li>
                    <li>
                        <a onClick={hdlCloseDropdown}>Close</a>
                    </li>
                </ul>
            )}
            {isModalOpen && (
                <UpdateTripModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    tripDetails={tripDetails}
                    onUpdate={(updatedData) => {
                        // Logic to handle the update and generate new trip plan
                    }}
                />
            )}
        </div>
    )
}

export default MenuMainTrip