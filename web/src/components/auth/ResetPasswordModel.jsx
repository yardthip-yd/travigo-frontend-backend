// Import
import React, { useState } from 'react'
import { toast } from 'react-toastify';

// Import Store
import useResetPasswordStore from '@/stores/resetPasswordStore';

const ResetPasswordModel = ({ isOpen, onClose, onResetSuccess }) => {

    // State for the email input
    const [email, setEmail] = useState("");

    // State from Stores
    const actionSendResetLink = useResetPasswordStore(state => state.actionSendResetLink);

    // Fn for handle sending reset link
    const hdlSendResetLink = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            return toast.info("Please enter your email");
        }

        try {
            await actionSendResetLink(email);
            toast.success("Reset link sent to your email!");
            onResetSuccess(); // Optionally call success callback
            onClose(); // Close the modal
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Don't render anything if modal is closed
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 w-[400px] rounded-2xl">
                <h3 className="text-lg font-semibold">Reset Password</h3>
                <p>Enter your email to receive a reset password link.</p>
                <div>

                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full bg-slate-50 border-none my-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button
                    onClick={hdlSendResetLink} // Send reset link on click
                    className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full border-none w-full"
                >
                    Get Reset Password Link
                </button>
                <button
                    onClick={onClose}
                    className="btn text-slate-900 border-none rounded-full w-full mt-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ResetPasswordModel