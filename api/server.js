// Import
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");


// Run server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});