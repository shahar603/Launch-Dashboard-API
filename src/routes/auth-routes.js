const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const tokens = require("../auth/tokens");
const moment = require("moment");


// Logging out
router.get("/logout", (req, res, next) => {
    // Handle with passport.js
    req.logout();
    res.redirect("/");
});


// Authentiacation with Google
router.get("/google", passport.authenticate("google", {
    scope: ["profile"]
}));


// Callback uri
router.get("/google/redirect", passport.authenticate("google", { session: false }), (req, res) => {
    const token = jwt.sign({ user: { id: req.user._id, username: req.user.username, date: moment().unix() } }, tokens.priKey, { algorithm: "RS256"});
    res.status(200).json({token});
});


module.exports = router;
