// Import
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotIcon } from "@/components/ui/icon";

// Import Store
import useTripStore from "@/stores/tripStore";

const MenuHotel = ({ onClose, tripId, hotelId }) => {
    // State for open/close dropdown
    const [isOpen, setIsOpen] = useState(false);

    // State from Stores
    const { actionDeleteHotel, actionGetUserTrips } = useTripStore();

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
            await actionDeleteHotel(tripId, hotelId);
            console.log("Hotel deleted successfully");
            await actionGetUserTrips();

            hdlCloseDropdown();
            navigate(`/view-trip/${tripId}`);
        } catch (error) {
            console.error("Error deleting hotel:", error);
        }
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
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 shadow text-center"
                >
                    <li>
                        <a onClick={hdlDelete}>Delete Hotel</a>
                    </li>
                    <li>
                        <a onClick={hdlCloseDropdown}>Close</a>
                    </li>
                </ul>
            )}
        </div>
    );
}

export default MenuHotel;
