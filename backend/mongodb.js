const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

const getDatabase = async () => {
    try {
        await client.connect();
        const database = client.db('h4i_technical_assessment_25');
        return database;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export { getDatabase };