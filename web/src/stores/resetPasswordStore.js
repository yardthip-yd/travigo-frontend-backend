// Import
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useResetPasswordStore = create(
    persist(
        (set) => ({
            email: null,
            resetStatus: null,
            isTokenValid: null,
            actionSendResetLink: async (email) => {

                console.log("Sending reset link to email:", email); 

                const response = await axios.post("http://localhost:9900/send-reset-link", { email });
                set({ email });

                console.log("Response from sending reset link:", response.data)

                return response.data;
            },
            actionResetPassword: async (token, newPassword) => {

                console.log("Resetting password with token:", token);
                console.log("New password:", newPassword);

                const response = await axios.post(`http://localhost:9900/reset-password/${token}`, { newPassword });
                set({ resetStatus: response.data.message });

                console.log("Response from resetting password:", response.data);

                return response.data;
            },
            actionCheckTokenValidity: async (token) => {
                console.log("Checking token validity:", token);
                try {
                    const response = await axios.get(`http://localhost:9900/reset-password/${token}`);
                    set({ isTokenValid: true }); 
                    return response.data;
                } catch (error) {
                    set({ isTokenValid: false }); 
                    throw new Error("Invalid or expired token");
                }
            },
            setTokenValidity: (isValid) => set({ isTokenValid: isValid }), // Fn for set status
            clearResetPasswordData: () => set({ email: null, resetStatus: null }), // Fn for clear status
        }),
        {
            name: "reset-password-state",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useResetPasswordStore;
