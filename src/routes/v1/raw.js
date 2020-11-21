// Import
const express = require("express");
const raw = require("../../controllers/v1/raw");
// middleware
const { checkIdentifiers } = require("../../middleware/v1/validator");
// Create an express router
const router = express.Router();

// Get the raw data from a launch
router.get("/:company", checkIdentifiers, raw.getOne);


module.exports = router;
