import React from 'react'

// Import Components
import Main from '@/components/homes/Main'
import FeatureA from '@/components/homes/FeatureA'
import FeatureB from '@/components/homes/FeatureB'
import PopDes from '@/components/homes/PopDes'

const Home = () => {
    return (
        <div className='overflow-auto relative'>
            <Main />
            {/* <PopDes /> */}
            <FeatureA />
            <FeatureB />
        </div>
    )
}

export default Home