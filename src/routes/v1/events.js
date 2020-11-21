// Import
const express = require("express");
const events = require("../../controllers/v1/events");
const { checkIdentifiers } = require("../../middleware/v1/validator");
// Create an express router
const router = express.Router();


// Get the events from a launch
router.get("/:company", checkIdentifiers, events.getOne);


module.exports = router;
