// Import
const express = require("express");
const raw = require("../controllers/raw");
// Create an express router
const router = express.Router();


// Get the raw data from a launch
router.get("/", raw.getOne);


module.exports = router;
