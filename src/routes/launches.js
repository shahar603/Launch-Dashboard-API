// Import
const express = require("express");
const launches = require("../controllers/launches");
// Create an express router
const router = express.Router();


// Get all the available data about a launch
router.get("/", launches.getOne);

// Add a launch to the database
router.post("/", launches.addOne);

// Update launch data
router.put("/", launches.updateOne);

// Delete a launch from the database
router.delete("/", launches.deleteOne);

// Get information about launches (all/single)
router.get("/info", launches.launches);




module.exports = router;
