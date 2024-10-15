// Import
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Import Routing
const gplaceRoute = require("./routes/gplace-route");
const gaiRoute = require("./routes/gai-route");

// Import Error
const errorMiddleware = require("../api/middleware/error-middleware");
const notFoundMiddleware = require("../api/middleware/not-found-middleware");

// Middleware
app.use(express.json());
app.use(cors());

// Routing
app.use("/api", gplaceRoute)
app.use("/api", gaiRoute)

// Error Middleware
app.use(errorMiddleware);
app.use("*", notFoundMiddleware) ;

// Run server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
