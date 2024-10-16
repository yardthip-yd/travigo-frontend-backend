// Import
import axios from 'axios'

export async function createTrip(tripData) {
    try {
        const response = await axios.post('http://localhost:9900/trip/create-trip', tripData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching create trip:', error);
        throw error;
    }
}