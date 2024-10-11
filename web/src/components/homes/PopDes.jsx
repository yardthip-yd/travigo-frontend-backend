import React from 'react'
import Carousel from './Carosel'

const PopDes = () => {
    return (
        <div className="max-h-[600px] w-full flex justify-center items-center bg-slate-50 px-[200px] py-[20px]">
            <div className="hero-content text-neutral-content pr-[100px] flex flex-col m-auto">
                <div className="w-full flex justify-center flex-col gap-8 items-center">
                    {/* Intro Step 1 */}
                    <div className="space-y-4 text-slate-500 flex items-center justify-center">
                        <h1 className="text-4xl font-medium text-center md:text-start leading-tight bg-gradient-to-r from-cyan-500 to-indigo-500 text-transparent bg-clip-text">
                            Popular Destinations
                        </h1>
                    </div>
                    <div>
                        {/* Carousel */}
                        <Carousel />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopDes