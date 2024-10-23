// Import
import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";

// Import store
import useAuthStore from '@/stores/authStore';

// Import VDO
import Authvdo from "@/assets/video/auth.mp4"

// Import Icon
import { EmailIcon, PasswordIcon } from "@/components/ui/icon";

// Import Reset Password
import ResetPasswordModal from '@/components/auth/ResetPasswordModel';

const Login = () => {

    // State from Stores
    const actionLogin = useAuthStore((state) => state.actionLogin)

    // Navigate
    const navigate = useNavigate();

    // useState for input
    const [input, setInput] = useState({
        email: "",
        password: ""
    })

    // State for controlling modal visibility (Reset Password)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fn handleChange update input when user fill information
    const hdlChange = (e) => {
        setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }))
    }

    // Fn handleRegister for register success
    const hdlLogin = async (e) => {
        try {
            e.preventDefault()

            // Validation 
            // Check user fill information or not?
            if (!(input.email.trim() && input.password.trim())) {
                return toast.info("Please fill all informations")
            }

            // Send information input
            const result = await actionLogin(input)

            // console.log("Login Successful!")
            toast.success("Login Successful!")

        } catch (err) {
            const errMsg = err.response?.data?.error || err.message
            // console.log("Login not success", errMsg)
            toast.error("Login not success", errMsg)
        }
    }

    // Fn to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Fn to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fn to handle reset success navigate to login
    const hdlResetSuccess = () => {
        setIsModalOpen(false);
    };

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

            {/* Intro */}
            <div className="m-auto py-16 px-12 p-6 flex flex-col items-center bg-white rounded-2xl w-[658px] h-[591px]">
                {/* Intro */}
                <div className="w-full flex flex-col text-start gap-2 text-slate-900">
                    <h2 className="text-5xl font-bold">Login</h2>
                    <p className="mb-4">
                        Welcome! Sign in to your account. We are so happy to have you here.
                    </p>
                </div>

                {/* Form Login */}
                <form
                    className="px-8 flex flex-col gap-3 relative pb-8 mt-16"
                    onSubmit={hdlLogin}
                >

                    {/* Email */}
                    <div className="flex flex-row items-center gap-1">
                        <EmailIcon className="w-6 h-6" />
                        <input
                            className="input input-bordered w-full bg-slate-50 border-none"
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={input.email}
                            onChange={hdlChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-row items-center gap-1">
                        <PasswordIcon className="w-6 h-6" />
                        <input
                            className="input input-bordered w-[389.43px] bg-slate-50 border-none"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={hdlChange}
                        />
                    </div>


                    {/* Button Register */}
                    <button className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full border-none mt-4 text-lg">
                        Log in
                    </button>

                </form>

                <div className="flex flex-col items-center gap-4">
                    {/* Forgot password */}
                    <div className="flex gap-1">
                        <p onClick={openModal} className="text-slate-400 cursor-pointer">Forgot Password?</p>
                    </div>
                    {/* Go to login */}
                    <div className="flex gap-1">
                        <p className="text-slate-900">Create an Account?</p>
                        <Link to={"/register"} className="hover:text-blue-500 transition-colors duration-300"><p className="text-sky-500">Register</p></Link>
                    </div>
                </div>
            </div>
            {/* Reset Password Modal */}
            <ResetPasswordModal isOpen={isModalOpen} onClose={closeModal} onResetSuccess={hdlResetSuccess} />
        </div>
    )
}

export default Login