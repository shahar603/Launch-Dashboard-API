module.exports = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },

    mongodb: {
        connectionString: process.env.CONNECTION_STRING,
    },

    s3: {
        region: process.env.AWS_S3_REGION,
        keyID: process.env.AWS_S3_KEY_ID,
        secretKey: process.env.AWS_S3_SECRET_KEY,
        bucketName: process.env.AWS_S3_BUCKET_NAME
    },

    redis: {
        redisConnectionString: process.env.REDIS_CONNECTION_STRING
    },

    jwt: {
        pubKey: process.env.JWT_PUBLIC_KEY,
        priKey: process.env.JWT_PRIVATE_KEY,
        passphrase: process.env.JWT_PASSPHRASE
    }

};

