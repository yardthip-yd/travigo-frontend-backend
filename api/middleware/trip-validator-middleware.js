// Import
const Joi = require("joi");
const createError = require("../utils/create-error")

// Validation
const tripSchema = Joi.object({
    destination: Joi.string().required().messages({
        "string.empty": "Destination is required.",
        "any.required": "Destination is required.",
    }),
    budget: Joi.string().valid("Economy", "Normal", "Luxury").required().messages({
        "any.only": "Budget must be one of the following: Economy, Normal, Luxury.",
        "any.required": "Budget is required.",
    }),
    travelers: Joi.string().valid("Solo", "Couple", "Family", "Friends").required().messages({
        "any.only": "Traveler must be one of the following: Solo, Couple, Family, Friends.",
        "any.required": "Traveler is required.",
    }),
    days: Joi.number().integer().min(1).max(10).required().messages({
        "number.base": "Number of days must be a number.",
        "number.integer": "Number of days must be an integer.",
        "number.min": "Number of days must be at least 1.",
        "number.max": "Number of days must be at most 10.",
        "any.required": "Number of days is required.",
    }),
    userId: Joi.number().integer().required().messages({
        "number.base": "User ID must be a number.",
        "number.integer": "User ID must be an integer.",
        "any.required": "User ID is required.",
    }),
    // jsonResponse: Joi.object().required().messages({
    //     "any.required": "JSON response is required.",
    // }),
    hotels: Joi.array().items(
        Joi.object({
            HotelName: Joi.string().required(),
            HotelAddress: Joi.string().required(),
            HotelPrice: Joi.string().required(),
            HotelGeoCoordinates: Joi.object({
                latitude: Joi.string().required(),
                longitude: Joi.string().required(),
            }).required(),
            HotelRating: Joi.string().required(),
            HotelDescription: Joi.string().required(),
        })
    ).required().messages({
        "any.required": "Hotels data is required.",
    }),
    itinerary: Joi.array().items(
        Joi.object({
            Day: Joi.string().required(),
            Places: Joi.array().items(
                Joi.object({
                    PlaceName: Joi.string().required(),
                    PlaceDetails: Joi.string().required(),
                    PlaceGeoCoordinates: Joi.object({
                        latitude: Joi.string().required(),
                        longitude: Joi.string().required(),
                    }).required(),
                    TicketPricing: Joi.string().required(),
                    StartTime: Joi.string().required(),
                    EndTime: Joi.string().required(),
                })
            ).required(),
        })
    ).required().messages({
        "any.required": "Itinerary data is required.",
    }),
});

// Fn to validate request body against the schema
const validateSchema = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body)
    if (error) {
        return createError(400, error.details[0].message)
    }
    req.input = value; // Store validated data in req.input
    next();
};

// Export
exports.tripValidator = validateSchema(tripSchema)