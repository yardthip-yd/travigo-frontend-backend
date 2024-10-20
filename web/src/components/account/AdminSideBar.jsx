// Import
import React from "react";

// Import Store
import useAuthStore from "@/stores/authStore";

const UserSideBar = ({ onSelect }) => {
    const actionLogout = useAuthStore((state) => state.actionLogout);

    return (
        <div className="flex flex-col max-xl:w-[256px] border-none rounded-2xl">
            <button
                className="btn btn-wide h-[80px] rounded-none bg-white border-none hover:bg-slate-100 shadow-none rounded-tl-2xl"
                onClick={() => onSelect("profile")}
            >
                My Profile
            </button>
            <button
                className="btn btn-wide h-[80px] rounded-none bg-white border-none hover:bg-slate-100 shadow-none"
                onClick={() => onSelect("dashboard")}
            >
                Manage User
            </button>
            <button
                className="btn btn-wide h-[80px] rounded-none bg-white border-none hover:bg-slate-100 shadow-none"
                onClick={actionLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default UserSideBar;
