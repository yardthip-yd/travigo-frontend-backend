import React from "react";
import { CorrectIcon } from "../ui/icon";

const FeatureA = () => {
    return (
        <div className="max-h-[600px] w-full min-w-[1440px] flex justify-start items-center bg-slate-50 px-[200px]">
            {/* Group A */}
            <div className="hero-content text-neutral-content lg:w-3/4 pt-20">
                {/* Picture Step 1 */}
                <div className="w-full flex justify-center">
                    <img
                        className="rounded-xl shadow-xl"
                        src={"https://picsum.photos/400/400"}
                        alt="img"
                    />
                </div>
            </div>

            {/* Group B */}
            <div className="hero-content text-neutral-content lg:w-3/4 pr-[100px]">
                <div className="w-full flex justify-center flex-col gap-8">
                    {/* Label Step 1 */}
                    <div>
                        <p className="bg-blue-100 w-20 flex items-center justify-center text-blue-500 p-2 rounded-xl">
                            Step 1
                        </p>
                    </div>

                    {/* Intro Step 1 */}
                    <div className="space-y-4 text-slate-500">
                        <h1 className="text-4xl font-medium text-center md:text-start leading-tight bg-gradient-to-r from-cyan-500 to-indigo-500 text-transparent bg-clip-text">
                            Where is your next trip?
                        </h1>
                        <p>
                            Tell us what you enjoy the most. Our Artificial Intelligence will
                            curate an itinerary matching all your needs.
                        </p>
                    </div>

                    {/* Details Step 1 */}
                    <div className="space-y-4 text-slate-500">
                        {/* No.1 */}
                        <div className="flex flex-row gap-5">
                            <p className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <CorrectIcon className="h-6 -ml-[2px]"/>
                            </p>
                            <h1 className="font-normal text-lg">
                                What is the purpose of your trip?
                            </h1>
                        </div>

                        {/* No.2 */}
                        <div className="flex flex-row gap-5 items-center">
                            <p className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <CorrectIcon className="h-6 -ml-[2px]"/>
                            </p>
                            <h1 className="font-normal text-lg">What are your interests?</h1>
                        </div>

                        {/* No.3 */}
                        <div className="flex flex-row gap-5 items-center">
                            <p className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <CorrectIcon className="h-6 -ml-[2px]"/>
                            </p>
                            <h1 className="font-normal text-lg">What is your budget?</h1>
                        </div>

                        {/* No.4 */}
                        <div className="flex flex-row gap-5 items-center">
                            <p className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <CorrectIcon className="h-6 -ml-[2px]"/>
                            </p>
                            <h1 className="font-normal text-lg">With who do you go with?</h1>
                        </div>

                        {/* No.5 */}
                        <div className="flex flex-row gap-5 items-center">
                            <p className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                <CorrectIcon className="h-6 -ml-[2px]"/>
                            </p>
                            <h1 className="font-normal text-lg">How long do you stay?</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureA;
