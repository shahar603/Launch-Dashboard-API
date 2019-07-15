const router = require("express").Router();
const passport = require("passport");


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
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.send(req.user);
});


module.exports = router;
