// Import packages
const express = require("express");
const mongoose = require("mongoose");
// Import middleware
const bodyParser = require("body-parser");
const requestSplitter = require("./middleware/request_splitting");
const errorHandler = require("./middleware/error_handler");
// Import routes
const launches = require("./routes/launches");


// Set the database connection string
global.DATABASE_NAME = "telemetry";
global.CONNECTION_STRING = `mongodb://localhost:27017/${global.DATABASE_NAME}`;


// Create an express app
const app = express();


// Connect to the database
mongoose.connect(global.CONNECTION_STRING,  {useNewUrlParser: true});
// Use the updated Promise instead of mongoose's deprecated one
mongoose.Promise = global.Promise;





// ##################### MIDDLEWARE #####################

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// Add request splitting middleware
app.use(requestSplitter);


// ##################### ROUTES #####################


// Use the routes we set up on routes/api.js
app.use("/v1/launches", launches);



// ##################### MIDDLEWARE #####################

// Promise rejection handling
app.use(errorHandler);



(function(){
    // Connect to monsgoose and create/connect to the db
    mongoose.connect(global.CONNECTION_STRING, {useNewUrlParser: true});

    mongoose.connection.once("open", function(){
        // Start the server on port 3000
        app.listen(process.env.PORT || 3000, () => {
            console.log("Running on port 3000");
        });
    }).on("error", function(err){
        console.log(`Connection Error: ${err}`);
    });
})();
