// Import packages
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
const socketio = require("socket.io");
const Redis = require("ioredis");
// Import middleware
const bodyParser = require("body-parser");
const requestSplitterV1 = require("./middleware/v1/request_splitting");
const requestSplitterV2 = require("./middleware/v2/request_splitting");
const errorHandler = require("./middleware/error_handler");
const filter = require("content-filter");
// Live
const live = require("./routes/v1/live");
const info = require("./routes/info");
// Import routes V1
const launchesV1 = require("./routes/v1/launches");
const rawV1 = require("./routes/v1/raw");
const analysedV1 = require("./routes/v1/analysed");
const eventsV1 = require("./routes/v1/events");
const infoV1 = require("./routes/v1/info");
const companyV1 = require("./routes/v1/company");
// Import routes V2
const launchesV2 = require("./routes/v2/launches");
const rawV2 = require("./routes/v2/raw");
const analysedV2 = require("./routes/v2/analysed");
const eventsV2 = require("./routes/v2/events");
const infoV2 = require("./routes/v2/info");
const companyV2 = require("./routes/v2/company");
// Authentication imports
const confirmAuth = require("./middleware/confirm_auth");
const authRoutes = require("./routes/auth-routes");
const keys = require("./auth/keys");
const passport = require("passport");
const passportSetup = require("./auth/passport-setup");
const cacheHelper = require("./helpers/cache_helper");
const tokens = require("./auth/tokens");
const jwt = require("jsonwebtoken");
var morgan = require("morgan");
process.setMaxListeners(0);

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
        const targetError = "READONLY";
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
    
    // Print redis connection to the console
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
// If the user tries to modify the database, make sure he/she is authenticated
app.use("*", confirmAuth);
// Allow Cross Origin Requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




// Logging the request (without identifing details);
app.use(morgan(function (tokens, req, res) {
    return [
        "[", tokens.date(req, res), "]",
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"), "-",
        tokens["response-time"](req, res), "ms"
    ].join(" ");
  }));

// ##################### ROUTES #####################

app.use("/", info);

app.all("/v1/*", requestSplitterV1);
// Use the routes we set up on routes/api.js
app.use("/v1/company", companyV1);
app.use("/v1/launches", launchesV1);
app.use("/v1/raw", rawV1);
app.use("/v1/analysed", analysedV1);
app.use("/v1/events", eventsV1);
app.use("/v1/live", live);
app.use("/v1", infoV1);

app.all("/v2/*", requestSplitterV2);
// Use the routes we set up on routes/api.js
app.use("/v2/company", companyV2);
app.use("/v2/launches", launchesV2);
app.use("/v2/raw", rawV2);
app.use("/v2/analysed", analysedV2);
app.use("/v2/events", eventsV2);
app.use("/v2/live", live);
app.use("/v2", infoV2);

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
    mongoose.connect(global.CONNECTION_STRING, {useNewUrlParser: true});
    tokens.setKeys();
    
    function setupLive(){
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

    }
setupLive();
})();
