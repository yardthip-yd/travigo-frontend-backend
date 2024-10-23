// Import
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Import Routing API
const gplaceRoute = require("./routes/gplace-route");
const gaiRoute = require("./routes/gai-route");

// Import Routing
const authRoute = require("./routes/auth-route");
const tripRoute = require("./routes/trip-route");
const memberRoute = require("./routes/member-route");

// Import Error
const errorMiddleware = require("../api/middleware/error-middleware");
const notFoundMiddleware = require("../api/middleware/not-found-middleware");

// Middleware
app.use(express.json());
app.use(cors());

// Routing API
app.use("/api", gplaceRoute)
app.use("/api", gaiRoute)

// Import Routing
app.use("/", authRoute)
app.use("/trip", tripRoute)
app.use("/member", memberRoute)

// Error Middleware
app.use(errorMiddleware);
app.use("*", notFoundMiddleware) ;

// Run server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
