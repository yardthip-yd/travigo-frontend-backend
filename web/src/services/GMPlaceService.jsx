// Import
import axios from 'axios';

// Import GPlace
import { googlePlaceKey } from "@/services/GPlaceService";

// Base URL for Google Places API
const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

// Fn for get place details using the fetched API key

export async function GetPlaceDetails(data) {
        try {
            const getGplaceKey = await googlePlaceKey();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': getGplaceKey,
                    'X-Goog-FieldMask': [
                        'places.photos',
                        'places.displayName',
                        'places.id'
                    ].join(',')
                }
            };
    
            const response = await axios.post(BASE_URL, data, config); 
            return response;
        } catch (error) {
            console.error('Error fetching place details:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

// Photo reference URL function that takes name and key as arguments
export function PHOTO_REF_URL(placeName, apiKey) {
    return `https://places.googleapis.com/v1/${placeName}/media?maxHeightPx=1000&maxWidthPx=1080&key=${apiKey}`};