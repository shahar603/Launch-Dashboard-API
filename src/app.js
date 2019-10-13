// Import packages
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const socketio = require("socket.io");
const Redis = require("ioredis");
// Import middleware
const bodyParser = require("body-parser");
const requestSplitter = require("./middleware/request_splitting");
const errorHandler = require("./middleware/error_handler");
const filter = require("content-filter");
// Import routes
const launches = require("./routes/launches");
const raw = require("./routes/raw");
const analysed = require("./routes/analysed");
const events = require("./routes/events");
const info = require("./routes/info");
const live = require("./routes/live");
const company = require("./routes/company");
// Authentication imports
const confirmAuth = require("./middleware/confirm_auth");
const authRoutes = require("./routes/auth-routes");
const keys = require("./auth/keys");
const passport = require("passport");
const passportSetup = require("./auth/passport-setup");
const cacheHelper = require("./helpers/cache_helper");
const tokens = require("./auth/tokens");
const jwt = require("jsonwebtoken");




global.REDIS_CONNECTION_STRING = keys.redis.redisConnectionString;
global.CONNECTION_STRING = keys.mongodb.connectionString;


// Create an express app
const app = express();



// create and connect redis client to Elasticache instance.
if (cacheHelper.doCache()){
    global.REDIS_CLIENT = new Redis({
        port: 6379,
        host: global.REDIS_CONNECTION_STRING,
      reconnectOnError: function (err) {
        var targetError = "READONLY";
        if (err.message.slice(0, targetError.length) === targetError) {
          // Only reconnect when the error starts with "READONLY"
          return true; // or `return 1;`
        }
      }
    });
    
    
    // Print redis errors to the console
    global.REDIS_CLIENT.on("error", (err) => {
      console.log("Error " + err);
    });
    
    // Print redis errors to the console
    global.REDIS_CLIENT.on("connect", (err) => {
      console.log("Connected to Redis");
    });
}




// ######################### AUTHENTICATION TOKEN ###################

// Initialize passport
app.use(passport.initialize());


// ##################### MIDDLEWARE #####################

// Alllow post requests with a lot of telemetry
app.use(bodyParser.json({limit: "10mb"}));
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({limit: "10mb", extended: true}));
// Validate the input to prevent NoSQL injection
app.use(filter());
// Parse the request
app.use(requestSplitter);
// If the user tries to modify the database, make sure he/she is authenticated
app.use("*", confirmAuth);
// Allow Cross Origin Requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// ##################### ROUTES #####################


// Use the routes we set up on routes/api.js
app.use("/v1/company", company);
app.use("/v1/launches", launches);
app.use("/v1/raw", raw);
app.use("/v1/analysed", analysed);
app.use("/v1/events", events);
app.use("/v1/live", live);
app.use("/", info);

// set up authentiacation routes
app.use("/auth", authRoutes);


// ##################### ERROR HANDLING #####################


// this is default in case of unmatched routes
app.use(function(req, res) {
    throw {status: 404, message: `path "${req.path}" does not exist`};
});

// Promise rejection handling
app.use(errorHandler);


module.exports = app;


(async function(){
    // Connect to monsgoose and create/connect to the db
    mongoose.connect(global.CONNECTION_STRING, {useNewUrlParser: true});
    tokens.setKeys();
    mongoose.connection.once("open", function(){
        // Start the server on port 3000
        const server = app.listen(process.env.PORT || 3000, () => {
            app.emit("ready");
            console.log("Running on port 3000");
        });


        const allowedEvents = ["raw", "analysed"];
        const io = socketio(server);
 
        io.on("connect", async function(socket){
            console.log("Made a connection", socket.id);

            try{
                const user = await jwt.verify(socket.handshake.query.access_token, tokens.pubKey, { algorithm: "RS256"});
                socket.user = user;
            }catch(ex){
                console.log(ex);
            }
            


            function registerEvent(event){
                socket.on(event, function(data) {
                    console.log(`${JSON.stringify(socket.user)} registered ${event}`);
                    
                    if (Object.keys(global.LIVE_TELEMETRY).includes(event)){
                        global.LIVE_TELEMETRY[event].push(data);
                        socket.broadcast.to(event).emit(event, data);
                    }
                });
            }

            socket.on("register", function(events) {
                if (!socket.user) return;

                events.forEach((event) => {
                    if (allowedEvents.includes(event))
                        registerEvent(event);
                });
            });


            socket.on("join", function(rooms) {
                rooms.forEach((room) => {
                    if (allowedEvents.includes(room))
                        socket.join(room);
                });
            });

        });



    }).on("error", function(err){
        console.log(`Connection Error: ${err}`);
    });
})();
