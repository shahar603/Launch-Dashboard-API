const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");
const crypto = require("crypto");




passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});




function addUserToDb(profile, done){
    User.create({
        username: profile.displayName,
        googleId: crypto.createHash("sha256").update(profile.id).digest("hex")
    }).then((result) => {
        console.log(`New user created: ${result.username}`);
        done(null, result);
    });
}



passport.use(
    new GoogleStrategy({
        callbackURL: "/auth/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // Check if user already exists in the database
        User.findOne({googleId: crypto.createHash("sha256").update(profile.id).digest("hex")}).
        then((result) => {
            if (result){
                done(null, result);
            }else{
                done(null, result);
                //addUserToDb(profile, done);
            }
        });

    })
);
