//Import
import React from "react";
import { Outlet } from "react-router-dom";

//Import Components
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


const PageLayout = () => {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <div className="flex flex-1 flex-col">
                <Navbar />
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default PageLayout;
