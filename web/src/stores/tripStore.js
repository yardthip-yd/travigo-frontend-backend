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
            set({ error: error.message });
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

            set({ trips: response.data.trips || [], loading: false });
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
    actionDeleteHotel: async (tripId, hotelId) => {
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.delete(`http://localhost:9900/trip/view-trip/${tripId}/hotels/${hotelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            set((state) => ({
                trips: state.trips.map(trip =>
                    trip.id === tripId
                        ? { ...trip, Hotel: trip.Hotel.filter(hotel => hotel.id !== hotelId) }
                        : trip
                ),
            }));

            console.log("Delete hotel in Zustand", response.data);

        } catch (error) {
            console.error("Error deleting hotel:", error);
            throw error;
        }
    },
    actionDeletePlace: async (tripId, placeId) => {
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.delete(`http://localhost:9900/trip/view-trip/${tripId}/places/${placeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Place deleted from state", response.data);
        } catch (error) {
            console.error('Error deleting place:', error);
            throw error;
        }
    },
    actionUpdateTrip: async (tripId, updatedData) => {
        try {
            const token = useAuthStore.getState().token;
            const response = await axios.put(`http://localhost:9900/trip/update-trip/${tripId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Updated Trip in Backend:", response.data.updatedTrip);
    
            // Update the state with the new trip data
            set((state) => ({
                trips: state.trips.map((trip) =>
                    trip.id === response.data.updatedTrip.id ? {
                        ...trip,
                        ...response.data.updatedTrip,
                    }
                    : trip
                ),
            }));
    
            return response.data.updatedTrip;
            
        } catch (error) {
            console.error('Error updating trip:', error);
            throw error;
        }
    },
}));

export default useTripStore;