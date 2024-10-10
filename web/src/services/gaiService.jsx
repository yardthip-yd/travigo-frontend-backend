// Import
import axios from 'axios';

// Import GAI
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Fn to fetch the AI API Key from backend
async function googleAiKey() {
    try {
        const response = await axios.get('http://localhost:9900/api/get-gai-key');
        // const data = await response.json();
        // return data.gaiKey;


        // console.log("Here is gai key", response.data.gaiKey)
        return response.data.gaiKey;
    } catch (error) {
        console.error('Error fetching AI API Key:', error);
        throw error;
    }
}

// Fn to create chat session by using the AI model
export async function createChatSession() {
    try {
        // Fetch the API Key
        const apiKey = await googleAiKey(); 
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
        };

        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    // User query
                    role: "user",
                    parts: [
                        { text: "Generate Travel Plan for Destination: Bangkok, for 3 Days for Couple with Economy budget. Give me a Hotels options list with HotelName, HotelAddress, HotelPrice currency in Thai Bath, HotelImageURL, HotelGeoCoordinates, HotelRating, HotelDescription and suggest itinerary with PlaceName, PlaceDetails, PlaceImageURL, PlaceGeoCoordinates,TicketPricing currency in Thai Bath (if any), Time travel each of the destinations for 3 days with each day plan with best time to visit in JSON format" },
                    ],
                },
                {
                    // Mock response from the model
                    role: "model",
                    parts: [
                        { text: "```json\n{\"hotelOptions\": [{\"HotelName\": \"The Quarter Bangkok\", \"HotelAddress\": \"1040/10-11 Phahonyothin Road, Samsen Nai, Phaya Thai, Bangkok 10400, Thailand\", \"HotelPrice\": \"1200\", \"HotelImageURL\": \"https://www.booking.com/hotel/th/the-quarter-bangkok.en-gb.html\", \"HotelGeoCoordinates\": {\"latitude\": 13.77922, \"longitude\": 100.51386}, \"HotelRating\": 4.0, \"HotelDescription\": \"The Quarter Bangkok is a stylish hotel located in the heart of Bangkok, offering a modern and comfortable stay. It features a rooftop pool and bar with panoramic city views, as well as a fitness center and spa. The hotel's central location makes it easy to explore the city's top attractions, including the Grand Palace and Wat Pho.\"}, {\"HotelName\": \"The Bedroom Bangkok\", \"HotelAddress\": \"132/1 Soi Sukhumvit 11, Klongtoey Nua, Watthana, Bangkok 10110, Thailand\", \"HotelPrice\": \"1500\", \"HotelImageURL\": \"https://www.agoda.com/the-bedroom-bangkok-2/hotel/bangkok-th.html\", \"HotelGeoCoordinates\": {\"latitude\": 13.73787, \"longitude\": 100.54912}, \"HotelRating\": 4.5, \"HotelDescription\": \"The Bedroom Bangkok is a boutique hotel located in the vibrant Sukhumvit district. It offers chic and modern rooms with private balconies, a rooftop terrace with a swimming pool and bar, and a restaurant serving Thai and international cuisine. The hotel's convenient location provides easy access to shopping malls, nightlife, and dining options.\"}, {\"HotelName\": \"Baan Thai House\", \"HotelAddress\": \"24/1 Sukhumvit 38, Klongton Nua, Watthana, Bangkok 10110, Thailand\", \"HotelPrice\": \"1000\", \"HotelImageURL\": \"https://www.expedia.com/Bangkok-Hotels-Baan-Thai-House.h1035766.Hotel-Information?chkin=2024-03-15&chkout=2024-03-18&rm1=a2&rfid=1000053337&gds=1&rfrr=1&lat=13.7258&lon=100.5526\", \"HotelGeoCoordinates\": {\"latitude\": 13.7258, \"longitude\": 100.5526}, \"HotelRating\": 4.0, \"HotelDescription\": \"Baan Thai House is a charming guesthouse offering a traditional Thai experience. It features beautifully decorated rooms with wooden furnishings, a communal courtyard with a swimming pool, and a cozy restaurant serving authentic Thai cuisine. The guesthouse's peaceful atmosphere provides a relaxing escape from the bustling city.\"}], \"itinerary\": [{\"day\": 1, \"plan\": [{\"PlaceName\": \"Wat Arun Ratchawararam Ratchawaramahawihan (Temple of Dawn)\", \"PlaceDetails\": \"One of the most iconic temples in Bangkok, renowned for its intricate porcelain decorations and towering central prang.\", \"PlaceImageURL\": \"https://www.lonelyplanet.com/media/images/w700/685/Wat-Arun-Bangkok-Thailand.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7314, \"longitude\": 100.4909}, \"TicketPricing\": \"50\"}, {\"PlaceName\": \"Wat Pho (Temple of the Reclining Buddha)\", \"PlaceDetails\": \"Home to the massive Reclining Buddha statue, a magnificent temple complex with intricate murals and traditional Thai massage schools.\", \"PlaceImageURL\": \"https://www.thailandtourismdirectory.com/photo/watpho.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7492, \"longitude\": 100.4919}, \"TicketPricing\": \"100\"}, {\"PlaceName\": \"Grand Palace\", \"PlaceDetails\": \"The former royal residence, showcasing stunning architecture, ornate temples, and traditional Thai art.\", \"PlaceImageURL\": \"https://www.thaitambon.com/images/photos/location/bangkok/grandpalace/grandpalace-01.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7496, \"longitude\": 100.4923}, \"TicketPricing\": \"500\"}, {\"PlaceName\": \"Khao San Road\", \"PlaceDetails\": \"A vibrant and lively backpacker haven, filled with street food stalls, shops, and bars.\", \"PlaceImageURL\": \"https://www.lonelyplanet.com/media/images/w700/685/Khao-San-Road-Bangkok-Thailand.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7505, \"longitude\": 100.5025}}], \"bestTimeToVisit\": \"Morning\"}, {\"day\": 2, \"plan\": [{\"PlaceName\": \"Jim Thompson House\", \"PlaceDetails\": \"A historic teak house, showcasing the life and work of American businessman Jim Thompson, who revived the Thai silk industry.\", \"PlaceImageURL\": \"https://www.jimthompsonhouse.com/images/gallery/images/jim-thompson-house-1.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7325, \"longitude\": 100.5403}, \"TicketPricing\": \"100\"}, {\"PlaceName\": \"Wat Phra Kaew (Temple of the Emerald Buddha)\", \"PlaceDetails\": \"A sacred temple, housing the revered Emerald Buddha, a small but exquisite statue.\", \"PlaceImageURL\": \"https://www.lonelyplanet.com/media/images/w700/685/Wat-Phra-Kaew-Bangkok-Thailand.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7504, \"longitude\": 100.4925}, \"TicketPricing\": \"500\"}, {\"PlaceName\": \"Chinatown\", \"PlaceDetails\": \"A bustling neighborhood, filled with street food vendors, traditional Chinese medicine shops, and temples.\", \"PlaceImageURL\": \"https://www.lonelyplanet.com/media/images/w700/685/Chinatown-Bangkok-Thailand.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7387, \"longitude\": 100.5073}}], \"bestTimeToVisit\": \"Afternoon\"}, {\"day\": 3, \"plan\": [{\"PlaceName\": \"Chatuchak Weekend Market\", \"PlaceDetails\": \"A vast market, offering a wide variety of goods, from clothing and souvenirs to antiques and plants.\", \"PlaceImageURL\": \"https://www.lonelyplanet.com/media/images/w700/685/Chatuchak-Weekend-Market-Bangkok-Thailand.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.8129, \"longitude\": 100.5534}, \"TicketPricing\": \"Free\"}, {\"PlaceName\": \"Lumphini Park\", \"PlaceDetails\": \"A large green space in the heart of the city, offering a peaceful retreat from the hustle and bustle.\", \"PlaceImageURL\": \"https://www.lonelyplanet.com/media/images/w700/685/Lumphini-Park-Bangkok-Thailand.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7348, \"longitude\": 100.5368}, \"TicketPricing\": \"Free\"}, {\"PlaceName\": \"Asiatique The Riverfront\", \"PlaceDetails\": \"A large entertainment complex, offering shopping, dining, and live entertainment along the Chao Phraya River.\", \"PlaceImageURL\": \"https://www.lonelyplanet.com/media/images/w700/685/Asiatique-The-Riverfront-Bangkok-Thailand.jpg\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7141, \"longitude\": 100.5013}, \"TicketPricing\": \"Free\"}], \"bestTimeToVisit\": \"Evening\"}]}\n\n```" },
                    ],
                },
            ],
        });

        return chatSession

    } catch (error) {
        console.error('Error running AI model:', error);
    }
}