// db.js

const { MongoClient } = require('mongodb');

const dbConnectionString = process.env.MONGO_DB_CONN_STR; // Sostituisci con la tua stringa di connessione

async function connectToMongoDB() {
  const client = new MongoClient(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Conntected to MongoDB');
    return client.db(); // Ritorna l'istanza del database
  } catch (error) {
    console.error('Error during connection to the Database:', error);
    throw error;
  }
}

module.exports = { connectToMongoDB };
