import React from "react";
import { CorrectIcon } from "../ui/icon";
import FeatureBImage from "@/assets/image/FeatureB.jpg";

const FeatureB = () => {
    return (
        <div className="max-h-[600px] w-full flex justify-start items-center bg-slate-50 px-[200px] py-10">
            {/* Group B */}
            <div className="hero-content text-neutral-content lg:w-3/4 pl-[100px]">
                <div className="w-full flex justify-center flex-col gap-8">
                    {/* Label Step 1 */}
                    <div>
                        <p className="bg-blue-100 w-20 flex items-center justify-center text-blue-500 p-2 rounded-xl">
                            Step 2
                        </p>
                    </div>

                    {/* Intro Step 1 */}
                    <div className="space-y-4 text-slate-500">
                        <h1 className="text-4xl font-medium text-center md:text-start leading-tight bg-gradient-to-r from-cyan-500 to-indigo-500 text-transparent bg-clip-text">
                            Your itinerary will be ready in a matter of seconds
                        </h1>
                        <p>
                            Leave all the heavy lifting to us. Just enjoy your trip.
                        </p>
                    </div>

                    {/* Details Step 1 */}
                    <div className="space-y-4 text-slate-500">
                        {/* No.1 */}
                        <div className="flex flex-row gap-5">
                            <p className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <CorrectIcon className="w-6 h-6 -ml-[2px]" />
                            </p>
                            <h1 className="font-normal text-lg">
                                See the approximate time you need in each place
                            </h1>
                        </div>

                        {/* No.2 */}
                        <div className="flex flex-row gap-5 items-center">
                            <p className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <CorrectIcon className="w-6 h-6 -ml-[2px]" />
                            </p>
                            <h1 className="font-normal text-lg">Make the most of your precious travel days</h1>
                        </div>

                    </div>
                </div>
            </div>

            {/* Group A */}
            <div className="hero-content text-neutral-content lg:w-3/4 pt-20">
                {/* Picture Step 1 */}
                <div className="w-full flex justify-center">
                    <img
                        className="rounded-xl shadow-xl w-[400px] h-[400px] object-cover"
                        src={FeatureBImage}
                        alt="img"
                    />
                </div>
            </div>

        </div>
    );
};

export default FeatureB;
