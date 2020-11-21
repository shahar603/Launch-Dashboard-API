// Imports
const express = require("express");
const info = require("../../controllers/v2/info");
// Create an express router
const router = express.Router();

router.get("/", info.api);
router.get("/v2", info.versions);

module.exports = router;
