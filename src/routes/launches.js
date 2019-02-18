// Import
const express = require("express");
const launches = require("../controllers/launches");
// Create an express router
const router = express.Router();
// middleware
const { checkIdentifiers } = require("../middleware/validator");



// Get all the available data about a launch
router.get("/", checkIdentifiers, launches.getOne);

// Add a launch to the database
router.post("/", checkIdentifiers,launches.addOne);

// Update launch data
router.put("/", checkIdentifiers, launches.updateOne);

// Delete a launch from the database
router.delete("/", checkIdentifiers, launches.deleteOne);

// Get information about launches (all/single)
router.get("/info", launches.info);




module.exports = router;
