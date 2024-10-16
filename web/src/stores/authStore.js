// Import
import axios from "axios"
import { create } from "zustand"

import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            actionRegister: async (input) => {
                // get input from outside

                const result = await axios.post("http://localhost:9900/auth/register", input)
                console.log("Register in Zustand", result.data.message)
            },
            actionLogin: async (input) => {
                // get input from outside

                const result = await axios.post("http://localhost:9900/auth/login", input)
                console.log("Login in Zustand", result.data)

                set({
                    token: result.data.token,
                    user: result.data.user
                })

                return result.data
            },
            actionLogout: () => {
                localStorage.clear()
                set({
                    token: null,
                    user: null
                })
            }
        }),
        // data will store in local storage
        {
            name: "state",
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useAuthStore
