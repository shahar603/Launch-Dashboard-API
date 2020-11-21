// Imports
const express = require("express");
const live = require("../../controllers/v2/live");
// Create an express router
const router = express.Router();


router.get("/info", live.info);
router.get("/telemetry", live.telemetry);
router.post("/reset", live.resetLiveEvent);


module.exports = router;
