// Imports
const express = require("express");
const info = require("../../controllers/v1/info");
// Create an express router
const router = express.Router();

router.get("/", info.api);
router.get("/v1", info.versions);

module.exports = router;
