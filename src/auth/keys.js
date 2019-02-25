module.exports = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },

    session: {
        cookieKey: process.env.COOKIE_KEY
    },

    mongodb: {
        connectionString: process.env.DB_CONNECTION_STRING
    }

};
