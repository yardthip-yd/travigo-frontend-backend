// Import
import React from 'react'
import { Outlet } from "react-router-dom";

//Import Components
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UserNavbar from '@/components/UserNavbar';

const TripLayout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="flex flex-1 flex-col flex-grow">
                {/* <Navbar /> */}
                <UserNavbar />
                <Outlet />
                <Footer />
            </div>
        </div>
    )
}

export default TripLayout