const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");


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
        googleId: profile.id
    }).then((result) => {
        console.log(`New user created: ${result}`);
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
        User.findOne({googleId: profile.id}).
        then((result) => {
            if (result){
                console.log("User already exists");
                done(null, result);
            }else{
                addUserToDb(profile);
            }
        });



    })
);
