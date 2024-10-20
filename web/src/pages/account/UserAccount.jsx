// Import
import React, { useState } from 'react'
import UserSideBar from '@/components/account/UserSideBar'
import UserProfile from '@/components/account/UserProfile'

const UserAccount = () => {

  // useState for select content
  const [selectedContent, setSelectedContent] = useState('profile')

  // Mapping Content
  const contentMap = {
    profile: <UserProfile />,
  }

  return (
    <div className="min-w-[1080px] flex flex-row gap-2 items-start mx-auto rounded-2xl mb-8 shadow-lg">
      <UserSideBar onSelect={setSelectedContent}/>
      {contentMap[selectedContent]}
    </div>
  )
}

export default UserAccount