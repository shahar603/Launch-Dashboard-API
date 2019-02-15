module.exports = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },

    session: {
        cookieKey: process.env.COOKIE_KEY
    },

    mongodb: {
        userID: process.env.MONGO_USER_ID,
        userKey: process.env.MONGO_USER_KEY
    }

};
