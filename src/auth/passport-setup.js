const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");
const crypto = require("crypto");

function getId(id){
    return crypto.createHash("sha256").update(id).digest("hex");
}

passport.use(
    new GoogleStrategy({
        callbackURL: "/auth/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        const userId = getId(profile.id);

        // Check if user already exists in the database
        User.findOne({googleId: userId}).
            then((result) => {
                if (result){
                    done(null, result, null);
                }else{
                    done(null, null, null);
                }
            });

    })
);
