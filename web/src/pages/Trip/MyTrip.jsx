// Import
import React from 'react'

// Import VDO
import Mainvdo from "@/assets/video/main.mp4";
import UserCardMyTrip from '@/components/trips/UserCardMyTrip';


const MyTrip = () => {
  return (
    <div className="h-screen w-full flex items-start min-h-[500px] overflow-auto">
      {/* Background */}
      <div>
        <video
          className="absolute right-0 top-0 h-screen w-full object-cover z-[-1]"
          src={Mainvdo}
          autoPlay
          loop
          muted
        ></video>
        {/* Black Overlay */}
        <div className="absolute h-screen inset-0 bg-black opacity-60 z-[-1]"></div>
      </div>

      <div className="w-full flex-grow my-[30px] flex flex-col items-start">
        <div className="m-auto rounded-xl p-4 flex flex-col gap-4 items-center bg-white bg-opacity-90 relative drop-shadow-2xl shadow-2xl">
          <div className="bg-white rounded-xl shadow-xl w-[1080px] min-h-[550px] p-2">
            <h2 className="font-bold text-xl p-4">My Trips</h2>
            <UserCardMyTrip />
          </div>
        </div>
      </div>

    </div>
  )
}

export default MyTrip