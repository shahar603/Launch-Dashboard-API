// Imports
const express = require("express");
const mongoose = require("mongoose");
const Launches = require("../models/launch");
// Create an express router
const router = express.Router();








// Get information about all avavilable launches
router.get("/launches", function(req, res, next){
    // Get all launches
    if (req.query.mission_id === null && req.query.flight_number){

    }
    // Get a specific launches
    else{

    }
});


// Add another launch to the database
router.post("/launches", function(req, res, next){

});


// Get the raw data from a launch
router.get("/raw", function(req, res, next){

});


// Get the analysed data from a launch
router.get("/analysed", function(req, res, next){

});


// Get the events from a specific launch
router.get("/events", function(req, res, next){

});


module.exports = router;
