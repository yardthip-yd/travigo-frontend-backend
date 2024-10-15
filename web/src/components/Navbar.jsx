// Import
import React from "react";
import { Link } from "react-router-dom";
import { LoginIcon } from "./ui/icon";

const Navbar = () => {
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
                                to={"/"}
                                className="no-underline hover:text-blue-500 transition-colors duration-300"
                            >
                                <p>Home</p>
                                {/* Underline effect */}
                                <span className="absolute left-0 right-0 bottom-[-6px] h-1 shadow-md bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            </Link>
                        </li>

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

                    <Link to={"/register"} className="btn btn-outline text-blue-500 rounded-full w-32 gap-2 outline outline-blue-500 outline-2 bg-white hover:bg-white hover:text-blue-500">
                        Register
                    </Link>

                    <Link to={"login"} className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-32 border-none gap-2 flex items-center">
                        <LoginIcon className="w-4 h-4" />
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
