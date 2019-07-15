// Import
const express = require("express");
const events = require("../controllers/events");
const { checkIdentifiers } = require("../middleware/validator");
// Create an express router
const router = express.Router();


// Get the events from a launch
router.get("/:company", checkIdentifiers, events.getOne);


module.exports = router;
