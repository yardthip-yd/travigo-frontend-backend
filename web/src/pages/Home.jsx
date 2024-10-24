import React from 'react'

// Import Components
import Main from '@/components/homes/Main'
import FeatureA from '@/components/homes/FeatureA'
import FeatureB from '@/components/homes/FeatureB'

const Home = () => {
    return (
        <div className='overflow-auto relative'>
            <Main />
            <div className='flex flex-col items-center bg-slate-50'>
            <FeatureA />
            <FeatureB />
            </div>
        </div>
    )
}

export default Home