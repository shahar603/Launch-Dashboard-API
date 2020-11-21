// Import
const express = require("express");
const analysed = require("../../controllers/v2/analysed");
const { checkIdentifiers } = require("../../middleware/v2/validator");
// Create an express router
const router = express.Router();


// Get the analysed data from a launch
router.get("/:company", checkIdentifiers, analysed.getOne);


module.exports = router;
