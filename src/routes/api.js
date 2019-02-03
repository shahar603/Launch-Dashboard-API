// Imports
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const Launch = require("../models/launch");
// Create an express router
const router = express.Router();








// Get information about all avavilable launches
router.get("/launches", function(req, res, next){
    // Get all launches
    if (_.isEmpty(req.identifiers)){
        Launch.find({}, "mission_id name flight_number").then(function(result){
            res.send(result);
        });
    }
    // Get a specific launches
    else{
        Launch.findOne(req.identifiers, "mission_id name flight_number").then(function(result){
            res.send(result);
        });
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
