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
                    role: "user",
                    parts: [
                        { text: "Generate Travel Plan for Destination: Bangkok, for 2 Days for Couple with Economy budget. Give me a Hotels options list with at least 4-5 options including HotelName, HotelAddress, HotelPrice per day currency in Thai Bath, HotelImageURL, HotelGeoCoordinates including latitude and  longitude, HotelRating, HotelDescription. Suggest an itinerary with at least 4-5 places to visit per day, including PlaceName, PlaceDetails, PlaceImageURL, PlaceGeoCoordinates including latitude and  longitude, TicketPricing currency in Thai Bath (if any), including StartTime and EndTime for visiting each place, in JSON format.\n" },
                    ],
                },
                {
                    role: "model",
                    parts: [
                        { text: "```json\n{\"hotelOptions\": [{\"HotelName\": \"The Urban Hostel\", \"HotelAddress\": \"235/1-2 Soi Sukhumvit 24, Klongton, Klongtoey, Bangkok 10110, Thailand\", \"HotelPrice\": 400, \"HotelImageURL\": \"https://www.booking.com/hotel/th/the-urban-hostel.en-gb.html\", \"HotelGeoCoordinates\": {\"latitude\": 13.74003, \"longitude\": 100.56308}, \"HotelRating\": 4.0, \"HotelDescription\": \"A modern and stylish hostel in a prime location, offering shared and private rooms with comfortable beds and free Wi-Fi. Guests can enjoy a common lounge, a rooftop terrace, and a fully equipped kitchen.\"}, {\"HotelName\": \"Lub d Bangkok Siam\", \"HotelAddress\": \"457/1-3 Rama 1 Rd, Wang Mai, Pathum Wan, Bangkok 10330, Thailand\", \"HotelPrice\": 600, \"HotelImageURL\": \"https://www.booking.com/hotel/th/lub-d-bangkok-siam.en-gb.html\", \"HotelGeoCoordinates\": {\"latitude\": 13.74745, \"longitude\": 100.52143}, \"HotelRating\": 4.5, \"HotelDescription\": \"A trendy and social hostel located near the Siam BTS station, featuring modern dormitory rooms, private rooms, and a rooftop bar with stunning city views.\"}, {\"HotelName\": \"Baan Thai House\", \"HotelAddress\": \"56 Soi Sukhumvit 26, Klongton, Klongtoey, Bangkok 10110, Thailand\", \"HotelPrice\": 800, \"HotelImageURL\": \"https://www.booking.com/hotel/th/baan-thai-house.en-gb.html\", \"HotelGeoCoordinates\": {\"latitude\": 13.73771, \"longitude\": 100.55708}, \"HotelRating\": 4.2, \"HotelDescription\": \"A charming and traditional guesthouse offering comfortable rooms with private balconies, a peaceful garden, and a friendly atmosphere.\"}, {\"HotelName\": \"The House by Ginger\", \"HotelAddress\": \"360/6-7 Phahonyothin Road, Samsen Nai, Phaya Thai, Bangkok 10400, Thailand\", \"HotelPrice\": 1000, \"HotelImageURL\": \"https://www.booking.com/hotel/th/the-house-by-ginger.en-gb.html\", \"HotelGeoCoordinates\": {\"latitude\": 13.7674, \"longitude\": 100.5164}, \"HotelRating\": 4.0, \"HotelDescription\": \"A stylish and modern hotel located in a trendy area, offering comfortable rooms, a rooftop pool, and a vibrant restaurant.\"}, {\"HotelName\": \"Hotel Indigo Bangkok Wireless Road\", \"HotelAddress\": \"10 Wireless Road, Lumpini, Pathum Wan, Bangkok 10330, Thailand\", \"HotelPrice\": 1200, \"HotelImageURL\": \"https://www.ihg.com/hotelindigo/hotels/us/en/bangkok/bkkwr/hoteldetail\", \"HotelGeoCoordinates\": {\"latitude\": 13.7343, \"longitude\": 100.5365}, \"HotelRating\": 4.5, \"HotelDescription\": \"A boutique hotel located in a prime location, offering stylish rooms, a rooftop bar with city views, and a unique design inspired by the local culture.\"}], \"itinerary\": [{\"Day\": 1, \"DayPlan\": [{\"PlaceName\": \"Wat Arun Ratchawararam Ratchawaramahawihan\", \"PlaceDetails\": \"A stunning temple with intricate decorations and a towering central prang. Visit the temple in the morning to experience the tranquility and beauty of the sunrise.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Wat+Arun+Ratchawararam+Ratchawaramahawihan&tbm=isch&ved=2ahUKEwiD4b_1w7H8AhV9yzgGHU0_CQAQ2-cCegQIABAA&oq=Wat+Arun+Ratchawararam+Ratchawaramahawihan&gs_lcp=CgNpbWcQAzIECAAQQzIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABiAKIBygLSAQE2LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=s79mZ7D8J8K5mAXZiaSgAg&bih=768&biw=1536&hl=en#imgrc=W-L-g3z7wH4vRM\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7296, \"longitude\": 100.4923}, \"TicketPricing\": 50, \"StartTime\": \"08:00\", \"EndTime\": \"11:00\"}, {\"PlaceName\": \"Grand Palace\", \"PlaceDetails\": \"A magnificent complex of palaces, temples, and courtyards, once the residence of the Thai monarchs. Explore the opulent architecture and intricate decorations.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Grand+Palace&tbm=isch&ved=2ahUKEwjV_Y-Zw7H8AhVNxzgGHW7_D3EQ2-cCegQIABAA&oq=Grand+Palace&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABjAKIBygLSAQE4LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=x79mZ5qZJeW7mAXo2o2gAg&bih=768&biw=1536&hl=en#imgrc=C6sTq8f963U2rM\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7492, \"longitude\": 100.5016}, \"TicketPricing\": 500, \"StartTime\": \"11:30\", \"EndTime\": \"14:30\"}, {\"PlaceName\": \"Wat Pho\", \"PlaceDetails\": \"A renowned temple known for its giant reclining Buddha statue and traditional Thai massage school. Take a stroll through the serene grounds and admire the intricate murals.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Wat+Pho&tbm=isch&ved=2ahUKEwjN0Jqhw7H8AhVMyzgGHQ3qBzoQ2-cCegQIABAA&oq=Wat+Pho&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABjAKIBygLSAQE3LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=079mZ62cK8K7mAXH1624Ag&bih=768&biw=1536&hl=en#imgrc=8lT1a18X8x_hFM\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7488, \"longitude\": 100.4997}, \"TicketPricing\": 100, \"StartTime\": \"15:00\", \"EndTime\": \"17:00\"}, {\"PlaceName\": \"Khao San Road\", \"PlaceDetails\": \"A vibrant street filled with street food stalls, souvenir shops, and bustling nightlife. Explore the area in the evening for a taste of Bangkok's energy.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Khao+San+Road&tbm=isch&ved=2ahUKEwjCqO-hw7H8AhWjrzgGHW1jC-oQ2-cCegQIABAA&oq=Khao+San+Road&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABjAKIBygLSAQE4LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=279mZ7y5H8W7mAX41LqYAQ&bih=768&biw=1536&hl=en#imgrc=jZqYq4q5YxR1LM\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7501, \"longitude\": 100.5018}, \"TicketPricing\": null, \"StartTime\": \"18:00\", \"EndTime\": \"21:00\"}], \"BestTimeToVisit\": \"Morning to early evening\"}, {\"Day\": 2, \"DayPlan\": [{\"PlaceName\": \"Chatuchak Weekend Market\", \"PlaceDetails\": \"One of the largest and most popular markets in Southeast Asia, offering a wide range of goods, from clothing and souvenirs to antiques and plants.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Chatuchak+Weekend+Market&tbm=isch&ved=2ahUKEwih45nLw7H8AhWQyzgGHQ2hC_gQ2-cCegQIABAA&oq=Chatuchak+Weekend+Market&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABjAKIBygLSAQE3LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=479mZ7rLK8K7mAX2l4iYAg&bih=768&biw=1536&hl=en#imgrc=0840B7_yQvR6PM\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7569, \"longitude\": 100.5593}, \"TicketPricing\": null, \"StartTime\": \"09:00\", \"EndTime\": \"13:00\"}, {\"PlaceName\": \"Jim Thompson House\", \"PlaceDetails\": \"A museum dedicated to the life and work of Jim Thompson, an American silk merchant who played a key role in reviving Thai silk production.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Jim+Thompson+House&tbm=isch&ved=2ahUKEwi1s5nLw7H8AhV8yzgGHQ1QC2wQ2-cCegQIABAA&oq=Jim+Thompson+House&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABjAKIBygLSAQE2LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=579mZ769L8K7mAXn_o64Ag&bih=768&biw=1536&hl=en#imgrc=Zt99p11nV7bE7M\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7286, \"longitude\": 100.5323}, \"TicketPricing\": 100, \"StartTime\": \"14:00\", \"EndTime\": \"16:00\"}, {\"PlaceName\": \"Lumphini Park\", \"PlaceDetails\": \"A serene oasis in the heart of the city, perfect for a relaxing stroll or a picnic. Enjoy the fresh air, watch the locals practice tai chi, or rent a paddle boat on the lake.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Lumphini+Park&tbm=isch&ved=2ahUKEwi-3q7Lw7H8AhV_yzgGHQ2rD20Q2-cCegQIABAA&oq=Lumphini+Park&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABjAKIBygLSAQE5LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=679mZ62dL8K7mAXb8o24Ag&bih=768&biw=1536&hl=en#imgrc=J0e00G_088h7NM\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7351, \"longitude\": 100.5374}, \"TicketPricing\": null, \"StartTime\": \"16:30\", \"EndTime\": \"18:30\"}, {\"PlaceName\": \"Asiatique The Riverfront\", \"PlaceDetails\": \"A vibrant riverside night market with a wide range of shops, restaurants, and entertainment options. Enjoy the lively atmosphere, street food, and a stunning view of the Chao Phraya River.\", \"PlaceImageURL\": \"https://www.google.com/search?q=Asiatique+The+Riverfront&tbm=isch&ved=2ahUKEwiV_Y-Zw7H8AhVNxzgGHW7_D3EQ2-cCegQIABAA&oq=Asiatique+The+Riverfront&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQ6BAgAEB46BAgAEApKBAhBGABQ9gZY9gZYLmgAcAB4AIABjAKIBygLSAQE4LjEuMZgBAKABAaoBC2d3cy13aXotaW1n&sclient=img&ei=779mZ6K4K8K7mAXz0YqYAQ&bih=768&biw=1536&hl=en#imgrc=eL5f3q_o05i57M\", \"PlaceGeoCoordinates\": {\"latitude\": 13.7101, \"longitude\": 100.4966}, \"TicketPricing\": null, \"StartTime\": \"19:00\", \"EndTime\": \"22:00\"}], \"BestTimeToVisit\": \"Afternoon to evening\"}]}\n\n```" },
                    ],
                },
            ],
        });

        return chatSession

    } catch (error) {
        console.error('Error running AI model:', error);
    }
}