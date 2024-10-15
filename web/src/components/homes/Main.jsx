import React from 'react'
import { Link } from "react-router-dom"
import Mainvdo from "@/assets/video/main.mp4"

const Main = () => {
    return (
        <div className='h-screen w-full flex justify-start items-center min-h-[500px]'>
            {/* Background */}
            <div>
                <video
                    className="absolute right-0 top-0 h-screen w-full object-cover z-[-1]"
                    src={Mainvdo}
                    autoPlay
                    loop
                    muted
                >
                </video>

                {/* Black Overlay */}
                <div className="absolute h-screen inset-0 bg-black opacity-40 z-[-1]"></div>
            </div>

            <div className="hero-content text-neutral-content lg:w-3/4">
                <div className="max-w-md text-start">

                    {/* Intro */}
                    <div className="text-white drop-shadow-2xl">
                        <h2 className="mb-5 text-8xl font-bold" data-aos="fade-up">YOUR <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-transparent bg-clip-text">SMART</span>  TRAVEL PLANNER</h2>
                        <p className="mb-5 text-md" data-aos="fade-up" data-aos-deley="300" >
                            Whether you’re heading to a new city or exploring hidden gems, our trip planner offers custom itineraries to match your journey. Plan your trip with ease and make every moment count.
                        </p>
                    </div>

                    {/* Go to create trip */}
                    <Link to={"/trip"}className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-40 border-none">
                        Get Started
                    </Link>
                </div>
            </div>
        </div >
    )
}

export default Main