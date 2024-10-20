// Import
import React, { useState } from 'react'
import AdminSideBar from '@/components/account/AdminSideBar'
import UserProfile from '@/components/account/UserProfile'
import AdminDashbord from '@/components/account/AdminDashbord'

const UserAccount = () => {

  // useState for select content
  const [selectedContent, setSelectedContent] = useState('profile')

  // Mapping Content
  const contentMap = {
    profile: <UserProfile />,
    dashboard: <AdminDashbord />,
  }

  return (
    <div className="min-w-[1080px] flex flex-row gap-2 items-start mx-auto rounded-2xl mb-8 shadow-lg">
      <AdminSideBar onSelect={setSelectedContent}/>
      {contentMap[selectedContent]}
    </div>
  )
}

export default UserAccount