// Import
import axios from "axios";
import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            actionRegister: async (input) => {
                // get input from outside

                const result = await axios.post(
                    "http://localhost:9900/register",
                    input
                );
                // console.log("Register in Zustand", result.data.message)
            },
            actionLogin: async (input) => {
                // get input from outside

                const result = await axios.post(
                    "http://localhost:9900/login",
                    input
                );
                // console.log("Login in Zustand", result.data)

                set({
                    token: result.data.token,
                    user: result.data.user,
                });

                return result.data;
            },
            actionLogout: () => {
                localStorage.clear();
                set({
                    token: null,
                    user: null,
                });
            },
            actionCurrentUser: async () => {
                const token = useAuthStore.getState().token
                // console.log("Token getme:", token); 

                if (!token) {
                    console.error("No token found. Please log in."); // Log an error if token is not found
                    return; // Return early if token is not available
                }
                const response = await axios.get("http://localhost:9900/getme", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                set({ user: response.data.user });
            },
            actionUpdateUser: async (input) => {
                const token = useAuthStore.getState().token;
                // console.log("Token updateme:", token); 

                if (!token) return;
                const response = await axios.patch(
                    "http://localhost:9900/updateme",
                    input,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                set({ user: response.data.user }); // Update user in state
                return response.data; // Optionally return response data
            },
        }),
        // data will store in local storage
        {
            name: "state",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
