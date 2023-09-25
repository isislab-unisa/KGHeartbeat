const database = 'KGHeartbeatDB';
const collection = 'quality_analysis_data';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection);