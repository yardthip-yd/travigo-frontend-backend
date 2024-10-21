// Import
import React from 'react'
import UserTable from './UserTable'

const AdminDashbord = () => {
  return (
    <div className="w-full flex flex-rol gap-4 items-start p-2 rounded-2xl shadow-2xl">

      {/* Infomation */}
      <div className="flex flex-col gap-8 mx-10 my-8">

        {/* Intro */}
        <div className="flex flex-col gap-2">
          <p className="font-bold text-2xl">User Management</p>
          <p className="text-base text-slate-500">Manage your menbers and their profile here</p>
        </div>

        {/* Member Table */}
          <UserTable />
      </div>
    </div>
  )
}

export default AdminDashbord