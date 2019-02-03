// Import poackages
const express = require("express");
const mongoose = require("mongoose");
// Import middleware
const bodyParser = require("body-parser");


// Set the database connection string
global.DATABASE_NAME = "telemetry"
global.CONNECTION_STRING = `mongodb://localhost/${global.DATABASE_NAME}`



// Create an express app
const app = express();


// Connect to the database
mongoose.connect(global.CONNECTION_STRING,  {useNewUrlParser: true});
// Use the updated Promise instead of mongoose's deprecated one
mongoose.Promise = global.Promise;


// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// Add request splitting middleware
app.use(require("./middleware/middleware"));


// Use the routes we set up on routes/api.js
app.use("/api/", require("./routes/api"));
// Promise rejection handling
app.use(function(err, req, res, next){
    //console.log(err);
    res.
        status(422).
        send({error: err._message});
});



// Start the server on port 3000
app.listen(process.env.PORT || 3000);
