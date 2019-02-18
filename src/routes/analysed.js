// Import
const express = require("express");
const analysed = require("../controllers/analysed");
const { checkIdentifiers } = require("../middleware/validator");
// Create an express router
const router = express.Router();


// Get the analysed data from a launch
router.get("/", checkIdentifiers, analysed.getOne);


module.exports = router;
