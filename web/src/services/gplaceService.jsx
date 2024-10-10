// Import
import axios from 'axios';

export async function googlePlaceKey() {
    try {
        const response = await axios.get('http://localhost:9900/api/get-gplace-key');
        return response.data.gplaceKey;
    } catch (error) {
        console.error('Error fetching Google API Key:', error);
        throw error;
    }
};