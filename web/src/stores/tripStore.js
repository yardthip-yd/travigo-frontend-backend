// Import
import axios from "axios"
import { create } from "zustand"

import useAuthStore from "@/stores/authStore";

const useTripStore = create((set) => ({
    trips: [],
    createTrip: async (tripData) => {
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.post('http://localhost:9900/trip/create-trip', tripData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });


            // Update the trips state
            set((state) => ({
                trips: [...state.trips, response.data],
            }));

            console.log("Create trip in Zustand", response.data)

            return response.data;

        } catch (error) {
            console.error('Error creating trip:', error);
            throw error;
        }
    },
    viewTrip: async (tripId) => {
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.get(`http://localhost:9900/trip/view-trip/${tripId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("View trip in Zustand", response.data)

            return response.data; // Return trip details
        } catch (error) {
            console.error('Error fetching view trip:', error);
            throw error;
        }
    },
    actionGetUserTrips: async () => {
        set({ loading: true });
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.get('http://localhost:9900/trip/user-trip', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({ trips: response.data.trips, loading: false });
        } catch (error) {
            console.error('Error fetching user trips:', error);
            set({ error: error.message, loading: false });
        }
    },
    actionDeleteTrip: async (tripId) => {
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.delete(`http://localhost:9900/trip/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { tripId }
            });


            set((state) => ({
                trips: state.trips.filter(trip => trip.id !== tripId),
            }));

            console.log("Delete trip in Zustand", response.data);

        } catch (error) {
            console.error('Error deleting trip:', error);
            throw error;
        }
    },
    actionUpdateTrip: async (tripData) => {
        try {
            const token = useAuthStore.getState().token;

            // Make sure to include tripId in the tripData
            const response = await axios.put(`http://localhost:9900/trip/update-trip/${tripData.id}`, tripData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Updating trip with data:", tripData);

            // Update the trips state to reflect the updated trip
            set((state) => ({
                trips: state.trips.map((trip) =>
                    trip.id === response.data.updatedTrip.id ? response.data.updatedTrip : trip
                ),
            }));

            console.log("Update trip in Zustand", response.data);
            return response.data; // Return updated trip data
        } catch (error) {
            console.error('Error updating trip:', error);
            throw error;
        }
    }
}));

export default useTripStore;