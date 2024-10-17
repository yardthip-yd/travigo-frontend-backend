// Import
import axios from "axios"
import { create } from "zustand"

const useTripStore = create((set) => ({
    trips: [],
    createTrip: async (tripData) => {
        try {
            const response = await axios.post('http://localhost:9900/trip/create-trip', tripData, {
                headers: {
                    'Content-Type': 'application/json',
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
            const response = await axios.get(`http://localhost:9900/trip/view-trip/${tripId}`);

            console.log("View trip in Zustand", response.data)

            return response.data; // Return trip details
        } catch (error) {
            console.error('Error fetching view trip:', error);
            throw error;
        }
    },
}));

export default useTripStore;