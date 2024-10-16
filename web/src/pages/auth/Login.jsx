// Import
import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { toast } from "react-toastify"

// Import State
import useAuthStore from '@/stores/authStore';

const Login = () => {

    // State from Stores
    const actionLogin = useAuthStore((state) => state.actionLogin)

    // useState for input
    const [input, setInput] = useState({
        email: "",
        password: ""
    })

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

            console.log("Login Successful!")
            toast.success("Login Successful!")

        } catch (err) {
            const errMsg = err.response?.data?.error || err.message
            console.log("Login not success", errMsg)
            toast.error("Login not success", errMsg)
        }
    }

    return (
        <div className="h-screen w-full flex items-center min-h-[500px] bg-gradient-to-br from-indigo-100 to-sky-100 bg-center">
            <div className="flex m-auto bg-white rounded-xl w-[1167.66px]">

                {/* Welcome */}
                <div className="text-white h-[583.83px] w-[583.83px] lg:w-1/2 rounded-l-xl flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-[url('assets/rpnickson1.jpg')]">
                    {/* <h1 className="text-3xl font-semibold mb-3">Welcome Back</h1>
                    <p className="">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p> */}
                </div>

                {/* Login */}
                <div className="w-full lg:w-1/2 py-16 px-12 p-6 flex flex-col items-center">
                    {/* Intro */}
                    <div className="w-full flex flex-col text-start gap-2 text-slate-900">
                        <h2 className="text-5xl font-bold">Login</h2>
                        <p className="mb-4">
                            {" "}
                            Create your account. It’s free and only take a minute.{" "}
                        </p>
                    </div>

                    {/* Form Login */}
                    <form 
                        className="px-8 flex flex-col gap-3 relative pb-8 mt-16"
                        onSubmit={hdlLogin}
                    >

                        {/* Email */}
                        <div className="flex flex-row items-center gap-1">
                            <p>icon</p>
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
                            <p>icon</p>
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

                    {/* Go to login */}
                    <div className="flex gap-1">
                        <p className="text-slate-900">Create an Account?</p>
                        <Link to={"/register"} className="hover:text-blue-500 transition-colors duration-300"><p className="text-sky-500">Register</p></Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login