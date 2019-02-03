// Import
const express = require("express");
const launches = require("../controllers/launches");
// Create an express router
const router = express.Router();





// Get information about all avavilable launches
router.get("/", launches.launches);


// Add another launch to the database
router.post("/", function(req, res, next){

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
