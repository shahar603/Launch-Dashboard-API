// Imports
const express = require("express");
const info = require("../controllers/info");
// Create an express router
const router = express.Router();


router.get("/", info.api);

router.get("/v1", info.info);


module.exports = router;
