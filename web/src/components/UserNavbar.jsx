// Import
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { useNavigate } from "react-router-dom";

// Import store
import useAuthStore from "@/stores/authStore";

const UserNavbar = () => {
    // State from Stores
    const user = useAuthStore((state) => state.user);
    const actionLogout = useAuthStore((state) => state.actionLogout);

    // useEffect(() => {
    //     if (user) {
    //         console.log("Current user:", user);
    //     }
    // }, [user]);

    // console.log("User role:", user.role);

    // Navigate
    const navigate = useNavigate();

    // Fn for Navigate
    const hdlSettingClick = () => {
        if (user.role === "ADMIN") {
            navigate("/admin/account");
        } else {
            navigate("/user/account");
        }
    };

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
                        <li className="relative group transition-colors">
                            <Link
                                to={"/my-trip"}
                                className="no-underline hover:text-blue-500 transition-colors duration-300"
                            >
                                <p>My Trip</p>
                                {/* Underline effect */}
                                <span className="absolute left-0 right-0 bottom-[-6px] h-1 shadow-md bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end gap-4 mx-4">
                    <p className="font-bold">Hello! {user.firstName}</p>
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
                                <Link to={"/my-trip"}>
                                    <p>My Trip</p>
                                </Link>
                            </li>
                            {/* Conditional rendering for My Account link */}
                            <li onClick={hdlSettingClick}>
                                <a>Setting</a>
                            </li>
                            <li onClick={actionLogout}>
                                <a>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserNavbar;
