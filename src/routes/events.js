// Import
const express = require("express");
const events = require("../controllers/events");
// Create an express router
const router = express.Router();


// Get the events from a launch
router.get("/", events.getOne);


module.exports = router;
