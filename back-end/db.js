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

async function find_single_data(kg_ids, quality_category, dimension_index) {
  if (!Array.isArray(kg_ids)) {
    kg_ids = [kg_ids];
  }
  try {
    const pipeline = [
      {
        $match: {
          'kg_id': { $in: kg_ids }
        }
      },
      {
        $sort: {
          'analysis_date': -1, // Sort based on the analysis data
          'kg_name': -1 // Sort based on the name
        }
      },
      {
        $group: {
          _id: '$kg_id', // group by id
          document: { $first: '$$ROOT' } // Get first document for every group
        }
      },
      {
        $replaceRoot: { newRoot: '$document' } // Substitute the root with the obtained document
      },
      {
        $project: {
          _id: 0,
          kg_id: 1,
          kg_name: 1,
          analysis_date: 1,
          Quality_category_array: { $arrayElemAt: [`$${quality_category}`, dimension_index] }
        }
      }
    ];
    const result = await dbInstance.collection('quality_analysis_data').aggregate(pipeline).toArray();
    
    return result;

  } catch (error) {
    console.error(error);
    
    return [];
  }
}

async function find_data_over_time(kg_ids,quality_category,dimension_index){
  if (!Array.isArray(kg_ids))
    kg_ids = [kg_ids]
  try{
    const result = await dbInstance.collection('quality_analysis_data').find(
      { 'kg_id': { $in : kg_ids} },
      {
          projection:{
              _id: 0, 
              kg_id: 1,
              kg_name: 1,
              analysis_date: 1,
              Quality_category_array: { $arrayElemAt: [`$${quality_category}`, dimension_index] }, 
          },
          sort: { kg_name: 1, analysis_date: 1}
      },
    ).toArray();

    return result
    
  } catch (error) {
    console.error(error)

    return []
  }
}

async function find_score_over_time(kg_ids,quality_category){
  if (!Array.isArray(kg_ids))
    kg_ids = [kg_ids]
  try{
    const result = await dbInstance.collection('quality_analysis_data').find(
      { 'kg_id': { $in : kg_ids} },
      {
          projection:{
              _id: 0, 
              kg_id: 1,
              kg_name: 1,
              analysis_date: 1,
              Score: 1, 
          },
          sort: { kg_name: 1, analysis_date: 1}
      },
    ).toArray();

    return result
    
  } catch (error) {
    console.error(error)

    return []
  }
}

async function searchKG(keywords){
  try{
    const result = await dbInstance.collection('quality_analysis_data').aggregate([
      {
        $match: {
          'kg_name': { $regex: `${keywords}`, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$kg_id',
          kg_name: { $first: '$kg_name' }
        }
      },
      {
        $project: {
          _id: 0,
          kg_id: '$_id',
          kg_name: 1
        }
      }
    ]).toArray();
    
    return result

  } catch (error) {
    console.error(error)

    return false
  }
}


module.exports = {connectToMongoDB, find_single_data, find_data_over_time, searchKG, find_score_over_time};
