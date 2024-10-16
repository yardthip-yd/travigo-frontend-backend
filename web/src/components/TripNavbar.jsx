// Import
import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import Avatar from '@/components/Avatar'

// Import store
import useAuthStore from '@/stores/authStore'

const TripNavbar = () => {

    // State from Stores
    const user = useAuthStore((state) => state.user)
    const actionLogout = useAuthStore((state) => state.actionLogout)

    useEffect(() => {
        if (user) {
            console.log("Current user:", user);
        }
    }, [user]);

    return (
        <div>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <a className="btn btn-ghost text-xl">daisyUI</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="px-1 flex space-x-4 gap-4">
                        <li className="relative group transition-colors">
                            <Link
                                to={"/trip"}
                                className="no-underline hover:text-blue-500 transition-colors duration-300"
                            >
                                <p>Create Trip</p>
                                {/* Underline effect */}
                                <span className="absolute left-0 right-0 bottom-[-6px] h-1 shadow-md bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end gap-4">
                    <p className='font-bold'>Hello! {user.firstName}</p>
                    <div className="dropdown dropdown-end mt-2">
                        <div tabIndex={0} role="button">
                            <Avatar
                                className="w-10 h-10 rounded-full flex items-center"
                                imgSrc={user?.profileImage}
                            />
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                        >
                            <li>
                                <a>My Account</a>
                            </li>
                            <li onClick={actionLogout}>
                                <a>Logout</a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TripNavbar