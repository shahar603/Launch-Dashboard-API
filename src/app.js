// Import packages
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const http = require("http");
const https = require("https");
const fs = require("fs");
const socket = require("socket.io");
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
// Authentication imports
const confirmAuth = require("./middleware/confirm_auth");
const authRoutes = require("./routes/auth-routes");
const keys = require("./auth/keys");
const passportSetup = require("./auth/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");



global.CONNECTION_STRING = `mongodb://${keys.mongodb.userID}:${keys.mongodb.userKey}@spacecluster-shard-00-00-duhqc.mongodb.net:27017,spacecluster-shard-00-01-duhqc.mongodb.net:27017,spacecluster-shard-00-02-duhqc.mongodb.net:27017/test?ssl=true&replicaSet=SpaceCluster-shard-0&authSource=admin&retryWrites=true`;
//global.CONNECTION_STRING = "mongodb://localhost:27017/telemetry";

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

//const privateKey  = fs.readFileSync(__dirname + "\\sslcert\\key.pem", "utf8");
//const certificate = fs.readFileSync(__dirname + "\\sslcert\\cert.pem", "utf8");
//const credentials = {key: privateKey, cert: certificate, passphrase: "xyzw"};


// ##################### MIDDLEWARE #####################

// Alllow post requests with a lot of telemetry
app.use(bodyParser.json({limit: "10mb"}));
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({limit: "10mb", extended: true}));
// Validate the input to prevemt NoSQL injection
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
app.use("/v1/launches", launches);
app.use("/v1/raw", raw);
app.use("/v1/analysed", analysed);
app.use("/v1/events", events);
app.use("/", info);


// set up authentiacation routes
app.use("/auth", authRoutes);


app.get("/upload", function(req, res){
    res.writeHead(200, {"Content-Type": "text/html"});
    let myReadStream = fs.createReadStream("static/index.html", "utf8");
    myReadStream.pipe(res);
});


app.get("/client", function(req, res){
    res.writeHead(200, {"Content-Type": "text/html"});
    let myReadStream = fs.createReadStream("static/acceleration.html", "utf8");
    myReadStream.pipe(res);
});


app.get("/mobile", function(req, res){
    res.writeHead(200, {"Content-Type": "text/html"});
    let myReadStream = fs.createReadStream("static/websockets.html", "utf8");
    myReadStream.pipe(res);
});


// ##################### ERROR HANDLING #####################


// this is default in case of unmatched routes
app.use(function(req, res) {
    throw {status: 404, message: `path "${req.path}" does not exist`};
});

// Promise rejection handling
app.use(errorHandler);


module.exports = app;



(function(){
    // Connect to monsgoose and create/connect to the db
    mongoose.connect(global.CONNECTION_STRING, {useNewUrlParser: true});

    mongoose.connection.once("open", function(){
        // Start the server on port 3000
        const server = app.listen(process.env.PORT || 3000, () => {
            console.log("Running on port 3000");
        });

        const io = socket(server);

        io.on("connection", function(socket){
            console.log("Made connection", socket.id);

            socket.on("raw", function(data) {
                socket.broadcast.emit("raw", data);
            });
        });


        /*const httpServer = http.createServer(app);
        const httpsServer = https.createServer(credentials, app);

        httpServer.listen(8080);
        httpsServer.listen(3000);*/
    }).on("error", function(err){
        console.log(`Connection Error: ${err}`);
    });
})();
