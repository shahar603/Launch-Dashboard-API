// Import
const express = require("express");
const analysed = require("../controllers/analysed");
// Create an express router
const router = express.Router();


// Get the analysed data from a launch
router.get("/", analysed.getOne);


module.exports = router;
