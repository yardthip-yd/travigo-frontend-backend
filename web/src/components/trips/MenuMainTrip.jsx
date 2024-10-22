// Import
import React, { useState } from 'react'
import { DotIcon } from "@/components/ui/icon";

const MenuMainTrip = ({ onEdit, onDelete, onClose }) => {

    // State for open/close dropdown
    const [isOpen, setIsOpen] = useState(false);

    // Fn for toggle dropdown
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // Fn for close dropdown
    const hdlCloseDropdown = () => {
        setIsOpen(false);
        onClose();
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
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-center"
                >
                    <li>
                        <a onClick={onEdit}>Edit Plan</a>
                    </li>
                    <li>
                        <a onClick={onDelete}>Delete Plan</a>
                    </li>
                    <li>
                        <a onClick={hdlCloseDropdown}>Close</a>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default MenuMainTrip