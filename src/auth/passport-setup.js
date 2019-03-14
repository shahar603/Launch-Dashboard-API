const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");
const crypto = require("crypto");




passport.serializeUser((user, done) => {
    done(null, user.attrs.googleId);
});

passport.deserializeUser((id, done) => {
    User.get(id, (err, user) => {
        if(!user)
            done(null, null);
        else{
            done(null, user.attrs);
        }
    });
});




function addUserToDb(profile, done){
    User.create({
        username: profile.displayName,
        googleId: crypto.createHash("sha256").update(profile.id).digest("hex")
    }, function(err, result){
        console.log(`New user created: ${result.attrs.username}`);
        done(null, result.attrs);
    });
}



passport.use(
    new GoogleStrategy({
        callbackURL: "/auth/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // Check if user already exists in the database
        User.get(
         {googleId: crypto.createHash("sha256").update(profile.id).digest("hex")},
         (err, result) => {
            if (result){
                done(null, result);
            }else{
                //done(null, result);
                addUserToDb(profile, done);
            }

        });
    })
);
