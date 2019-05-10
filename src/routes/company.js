// Import
const express = require("express");
const company = require("../controllers/company");
// Create an express router
const router = express.Router();

// another / route

// Get all the available data about a launch
router.get("/:company", company.getOneCompany);

// Add a launch to the database
router.post("/", company.addOneCompany);

// Update launch data
router.put("/", company.updateOneCompany);

// Delete a launch from the database
router.delete("/:company", company.deleteOneCompany);


module.exports = router;
