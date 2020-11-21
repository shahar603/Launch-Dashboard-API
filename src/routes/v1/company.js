// Imports
const express = require("express");
const company = require("../../controllers/v1/company");
// Create an express router
const router = express.Router();


// Get all available data about every company in the database
router.get("/", company.getAll);

// Get all the available data about a company
router.get("/:company", company.getOne);

// Add a company to the database
router.post("/", company.addOne);

// Update company data
router.put("/", company.updateOne);

// Delete a company from the database
router.delete("/:company", company.deleteOne);


module.exports = router;
