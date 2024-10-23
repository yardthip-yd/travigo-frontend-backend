import React from 'react'

// Import Components
import Main from '@/components/homes/Main'
import FeatureA from '@/components/homes/FeatureA'
import FeatureB from '@/components/homes/FeatureB'

const Home = () => {
    return (
        <div className='overflow-auto relative'>
            <Main />
            <FeatureA />
            <FeatureB />
        </div>
    )
}

export default Home