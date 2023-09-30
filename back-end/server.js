const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./db');
const knowledge_graph_router = require('./routes/knowledge_graph');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//TODO: is possible to limitate the use of a middleware only for a specific path request
app.use(async (req, res, next) => {
    try {
        req.db = await connectToMongoDB(); // Ottieni la connessione dal pool
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during the connection to the DB');
    }
});

app.use('/knowledge_graph',knowledge_graph_router);


app.listen(port,() => {
    console.log(`Server is running on port: ${port}`);
})