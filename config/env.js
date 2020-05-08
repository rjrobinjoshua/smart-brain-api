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
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        client: process.env.DB_CLIENT
    },
    clarifai: {
        apikey: process.env.CLARIFAI_API_KEY
    }
}