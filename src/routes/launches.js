// Import
const express = require("express");
const launches = require("../controllers/launches");
// Create an express router
const router = express.Router();
// middleware
const { checkIdentifiers } = require("../middleware/validator");
const { checkLaunch } = require("../middleware/launch_validator.js");



// Get all the available data about a launch
router.get("/:company", launches.getLaunches);

// Returns an error because not a valid query
router.get("/", launches.getError);

// Add a launch to the database
router.post("/", checkLaunch, launches.addOne);

// Update launch data
router.put("/", checkLaunch, launches.updateOne);

// Delete a launch from the database
router.delete("/:company", checkIdentifiers, launches.deleteOne);

// Get information about launches (all/single)
router.get("/info/:company", launches.info);




module.exports = router;
