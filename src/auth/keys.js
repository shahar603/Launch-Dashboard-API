module.exports = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },

    session: {
        cookieKey: process.env.COOKIE_KEY
    },

    mongodb: {
        connectionString: process.env.CONNECTION_STRING,
        userID: process.env.MONGO_USER_ID,
        userKey: process.env.MONGO_USER_KEY
    },

    s3: {
        region: process.env.AWS_S3_REGION,
        keyID: process.env.AWS_S3_KEY_ID,
        secretKey: process.env.AWS_S3_SECRET_KEY,
        bucketName: process.env.AWS_S3_BUCKET_NAME
    },

    redis: {
        redisConnectionString: process.env.REDIS_CONNECTION_STRING
    }

};
