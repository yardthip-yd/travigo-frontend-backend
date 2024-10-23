// Import
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginCard = ({ onClose }) => {
    // Navigate
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 w-[450px] rounded-2xl">
                <h3 className="text-2xl font-semibold">Login Required</h3>
                <p className="py-6">
                    If you already have an account, please log in. If not, please create an account.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-1/2 border-none"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                    <button
                        className="btn text-slate-900 border-none w-1/2 rounded-full"
                        onClick={() => navigate("/register")}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginCard;
