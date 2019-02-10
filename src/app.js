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



const connnectionString = `mongodb://${keys.atlas.dbUserName}:${keys.atlas.dbUserPassword}@spacecluster-shard-00-00-duhqc.mongodb.net:27017,spacecluster-shard-00-01-duhqc.mongodb.net:27017,spacecluster-shard-00-02-duhqc.mongodb.net:27017/test?ssl=true&replicaSet=SpaceCluster-shard-0&authSource=admin&retryWrites=true/${keys.atlas.dbName}`;



// Create an express app
const app = express();




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
    mongoose.connect(connnectionString, {useNewUrlParser: true});

    mongoose.connection.once("open", function(){
        // Start the server on port 3000
        app.listen(process.env.PORT || 3000, () => {
            console.log("Running on port 3000");
        });
    }).on("error", function(err){
        console.log(`Connection Error: ${err}`);
    });
})();
