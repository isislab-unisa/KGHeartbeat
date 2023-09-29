const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./db');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Funzione per connettersi al database MongoDB
async function connectToMongoDB() {
    const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      return client.db(); // Ritorna l'istanza del database
    } catch (error) {
      console.error('Error during connection to the DB: ', error);
      throw error;
    }
}

connectToMongoDB()

app.listen(port,() => {
    console.log(`Server is running on port: ${port}`);
})