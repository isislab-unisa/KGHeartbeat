const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbInstance = null; // This is used to store the DB connection

async function connectToMongoDB() {
  if (!dbInstance) {
    const client = new MongoClient(process.env.MONGO_DB_CONN_STR);
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      dbInstance = client.db(process.env.DB_NAME);
    } catch (error) {
      console.error('Error during connection to the Database:', error);
      throw error;
    }
  }
  return dbInstance;
}

module.exports = {connectToMongoDB};
