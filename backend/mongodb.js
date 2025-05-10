const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error('Please add your Mongo URI to .env');
}

const client = new MongoClient(uri);

const getDatabase = async (db) => {
    try {
        await client.connect();
        const database = client.db(db);
        return database;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { getDatabase };