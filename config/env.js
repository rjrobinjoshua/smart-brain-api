const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// do this validation only in development env
if(process.env.NODE_ENV !== 'production') {
    const envFound = dotenv.config();
    if (envFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
    }
}

module.exports = {
    port: parseInt(process.env.PORT, 10),
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
        max: parseInt(process.env.RATE_LIMIT_MAX, 10)
    },
    db: {
        client: process.env.DB_CLIENT,
        connectionUrl: process.env.DATABASE_URL,
        ssl: (process.env.DB_SSL === "true")
    },
    clarifai: {
        apikey: process.env.CLARIFAI_API_KEY
    }
}