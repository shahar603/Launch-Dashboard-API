// Import packages
const express = require("express");
const mongoose = require("mongoose");
// Import middleware
const bodyParser = require("body-parser");
const requestSplitter = require("./middleware/request_splitting");
const errorHandler = require("./middleware/error_handler");
// Import routes
const launches = require("./routes/launches");
const raw = require("./routes/raw");
const analysed = require("./routes/analysed");
const events = require("./routes/events");
// Authentication imports
const confirmAuth = require("./middleware/confirm_auth");
const authRoutes = require("./routes/auth-routes");
const keys = require("./auth/keys");
const passportSetup = require("./auth/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");





// Set the database connection string
global.DATABASE_NAME = "telemetry";
global.CONNECTION_STRING = `mongodb://localhost:27017/${global.DATABASE_NAME}`;


// Create an express app
const app = express();


// Connect to the database
mongoose.connect(global.CONNECTION_STRING,  {useNewUrlParser: true});
// Use the updated Promise instead of mongoose's deprecated one
mongoose.Promise = global.Promise;


// ######################### AUTHENTICATION COOKIE ###################


// Session cookie settings
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());





// ##################### MIDDLEWARE #####################

// Alllow post requests with a lot of telemetry
app.use(bodyParser.json({limit: "10mb"}));
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({limit: "10mb", extended: true}));
// Parse the request
app.use(requestSplitter);
// If the user tries to modify the database, make sure he/she is authenticated
app.use("*", confirmAuth);



// ##################### ROUTES #####################


// Use the routes we set up on routes/api.js
app.use("/v1/launches", launches);
app.use("/v1/raw", raw);
app.use("/v1/analysed", analysed);
app.use("/v1/events", events);

// set up authentiacation routes
app.use("/auth", authRoutes);



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
