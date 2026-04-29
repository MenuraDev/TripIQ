const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Parse port as integer
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

// Configure SSL options for Aiven
let dialectOptions = {};
if (process.env.DB_SSL === 'true' || process.env.DB_SSL === true) {
    const sslConfig = {
        require: true,
        rejectUnauthorized: false // Set to false to allow self-signed certs initially
    };

    // Load CA certificate if provided
    if (process.env.DB_SSL_CA_PATH) {
        try {
            const caPath = path.resolve(__dirname, '..', process.env.DB_SSL_CA_PATH);
            const caCert = fs.readFileSync(caPath);
            sslConfig.ca = caCert;
            sslConfig.rejectUnauthorized = true; // Enable strict verification when CA is provided
            console.log('✅ CA certificate loaded from:', caPath);
        } catch (error) {
            console.error('❌ Failed to load CA certificate:', error.message);
            console.log('⚠️  Continuing with rejectUnauthorized: false');
        }
    }

    dialectOptions = { ssl: sslConfig };
} else {
    // For local development without SSL
    dialectOptions = {};
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: dbPort,
        dialect: 'mysql',
        logging: false, // Set to true to see behind-the-scenes SQL queries
        // Aiven requires SSL connection for cloud databases
        dialectOptions,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test the connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database connected successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
