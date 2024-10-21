// Import
import axios from "axios";
import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

import useAuthStore from "@/stores/authStore"

const useMemberStore = create(
    persist(
        (set) => ({
            members: [], // State to hold members
            loading: false, // Loading state
            error: null,
            totalMembers: 0,
            actionGetMembers: async (currentPage, membersPerPage) => {
                const token = useAuthStore.getState().token; // Get token from auth store
                set({ loading: true, error: null }); // Set loading state
                try {
                    const response = await axios.get("http://localhost:9900/member/", {
                        headers: {
                            Authorization: `Bearer ${token}`, // Attach the token in the header
                        },
                    });
                    set({ members: response.data.members, totalMembers: response.data.totalMembers }); // Update the members state
                } catch (err) {
                    set({ error: err.message });
                } finally {
                    set({ loading: false });
                }
            },
            actionUpdateMember: async (memberId, updatedData) => {
                const token = useAuthStore.getState().token; 
                set({ loading: true, error: null }); // Set loading state
                console.log("Updating member:", memberId, updatedData);

                try {
                    console.log("Sending data to update member from memberStore:", updatedData); 
                    const response = await axios.patch(
                        `http://localhost:9900/member/${memberId}`,
                        updatedData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    set((state) => ({
                        members: state.members.map((member) =>
                            member.id === memberId ? response.data.member : member
                        ),
                    }));
                } catch (err) {
                    set({ error: err.message });
                } finally {
                    set({ loading: false }); 
                }
            },
            actionDeleteMember: async (memberId) => {
                const token = useAuthStore.getState().token; // Get token from auth store
                set({ loading: true, error: null }); // Set loading state
                try {
                    await axios.delete(`http://localhost:9900/member/${memberId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Attach the token in the header
                        },
                    }); // Delete member
                    set((state) => ({
                        members: state.members.filter((member) => member.id !== memberId), // Remove deleted member from state
                    }));
                } catch (err) {
                    set({ error: err.message }); // Set error if API call fails
                } finally {
                    set({ loading: false }); // Reset loading state
                }
            },
        }),
        // data will store in local storage
        {
            name: "member-state",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useMemberStore;
