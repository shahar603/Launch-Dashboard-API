// Import
const express = require("express");
const raw = require("../controllers/raw");
// middleware
const { checkIdentifiers } = require("../middleware/validator");
// Create an express router
const router = express.Router();

// Get the raw data from a launch
router.get("/", checkIdentifiers, raw.getOne);


module.exports = router;
