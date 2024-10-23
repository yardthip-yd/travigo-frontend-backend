// Import
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

// Import VDO
import Authvdo from "@/assets/video/auth.mp4"

// Import Store
import useResetPasswordStore from '@/stores/resetPasswordStore';

const ResetPassword = () => {

    console.log("ResetPassword component is mounted");

    // useParam for Get the reset token from the URL
    const { token } = useParams();

    // useState for reset/create new password
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State from Stores
    const actionResetPassword = useResetPasswordStore(state => state.actionResetPassword);
    const actionCheckTokenValidity = useResetPasswordStore(state => state.actionCheckTokenValidity);
    const isTokenValid = useResetPasswordStore(state => state.isTokenValid);
    const setTokenValidity = useResetPasswordStore(state => state.setTokenValidity);

    // Navigate
    const navigate = useNavigate();

    // useEffect for 
    useEffect(() => {
        console.log("useEffect is running");
        const verifyToken = async () => { 
            console.log("Verifying token:", token);
            try {
                await actionCheckTokenValidity(token);
                setTokenValidity(true); 
                
                console.log("Token is valid")

            } catch (error) {
                console.error("Token validation failed:", error);
                setTokenValidity(false);
                toast.error("Invalid or expired token");
                navigate("/login");
            }
        };

        verifyToken();
    }, [token, actionCheckTokenValidity, navigate, setTokenValidity]);

    // Fn for reset password
    const hdlResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            const response = await actionResetPassword(token, newPassword); // Call the store action
            toast.success(response.message);

            console.log("Response from reset password:", response);
            navigate(`/login`)
        } catch (error) {
            toast.error(error.response.data.error || "Error resetting password");
        }
    };

    // If token not correct
    if (isTokenValid === null) {
        return <p>Checking token validity...</p>;
    }

    if (!isTokenValid) {
        toast.error("Invalid or expired token");
        navigate("/login");
        return null;
    }

    console.log("isTokenValid:", isTokenValid);

    return (
        <div className="h-screen w-full flex items-center min-h-[500px]">
            {/* Background */}
            <div>
                <video
                    className="absolute right-0 top-0 h-screen w-full object-cover z-[-1]"
                    src={Authvdo}
                    autoPlay
                    loop
                    muted
                >
                </video>
                {/* Black Overlay */}
                <div className="absolute h-screen inset-0 bg-black opacity-40 z-[-1]"></div>
            </div>

            <div className="m-auto bg-white p-6 rounded-2xl shadow-md w-[500px]">
                <div className="w-full flex flex-col text-start gap-2 text-slate-900">
                    <h2 className="text-3xl font-bold">Create New Password</h2>
                    <p className="mb-4">
                        Your new password must be different from previous used passwords.
                    </p>
                </div>

                <form onSubmit={hdlResetPassword} className="flex flex-col gap-3 relative my-6">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input input-bordered w-full bg-slate-50 border-none"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input input-bordered w-full bg-slate-50 border-none"
                    />
                    <button type="submit" className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full border-none w-full mt-4">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword