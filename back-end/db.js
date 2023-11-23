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

async function find_all_score() {
    try {
      const pipeline = [
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
            Score: 1,
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

async function find_extra_data(kg_ids){
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
              Extra: 1, 
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
          kg_name: { $first: '$kg_name' },
          Trust: { $first : '$Trust' },
          Extra: {$first : '$Extra'}
        }
      },
      {
        $project: {
          _id: 0,
          kg_id: '$_id',
          kg_name: 1,
          Believability: { $arrayElemAt: ["$Trust.Believability", 0] },
          Extra: 1 
        }
      },
    ]).toArray();
    
    return result

  } catch (error) {
    console.error(error)

    return false
  }
}

async function searchActiveKG(keywords,recent_analysis){
  try{
    const result = await dbInstance.collection('quality_analysis_data').aggregate([
      {
        $match: {
          $and: [
            {
              'kg_name': { $regex: `${keywords}`, $options: 'i' }
            },
            {
              'analysis_date': {$eq : recent_analysis}
            },
            {
              'Accessibility': {
                $elemMatch: {
                  'Availability.sparqlEndpoint': { $in: ["1", "Available"] }
                }
              }
            }
          ]
        }
      },
      {
        $group: {
          _id: '$kg_id',
          kg_name: { $first: '$kg_name' },
          Trust: { $first : '$Trust' },
          Accessibility: {$first : '$Availability'},
          analysis_date: { $first: '$analysis_date' },
          Extra: {$first : '$Extra'}
        }
      },
      {
        $project: {
          _id: 0,
          kg_id: '$_id',
          kg_name: 1,
          Believability: { $arrayElemAt: ["$Trust.Believability", 0] } ,
          Extra: 1
        }
      }
    ]).toArray();
    
    return result

  } catch (error) {
    console.error(error)

    return false
  }
}

async function find_selected_analysis(kg_ids,start_date,end_date,quality_categories){
  if (!Array.isArray(kg_ids))
    kg_ids = [kg_ids]
  try{
    const result = await dbInstance.collection('quality_analysis_data').find(
      { 'kg_id': { $in : kg_ids},
        'analysis_date' : {$gte: start_date, $lte: end_date}
      },
      {
          sort: { kg_name: 1, analysis_date: 1}
      },
    ).toArray();

    return result
    
  } catch (error) {
    console.error(error)

    return []
  }
}

async function find_most_recent_analysis_date(){
  try{
    const result = await dbInstance.collection('quality_analysis_data').find({},{"analysis_date" : 1}).sort("analysis_date", -1).limit(1).toArray();

    return(result[0]['analysis_date'])

  } catch (error){
    console.error(error)
    
    return [] 
  } 
}

async function find_analysis_date(){
  try {
    const pipeline = [
      {
        $sort: {
          'analysis_date': -1, // Sort based on the analysis data
        }
      },
      {
        $group: {
          _id: '$analysis_date', // group by id
          document: { $first: '$$ROOT' } // Get first document for every group
        }
      },
      {
        $replaceRoot: { newRoot: '$document' } // Substitute the root with the obtained document
      },
      {
        $project: {
          _id: 0,
          analysis_date: 1,
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


module.exports = {connectToMongoDB, find_single_data, find_data_over_time, searchKG, find_score_over_time, find_extra_data, find_selected_analysis, searchActiveKG, find_most_recent_analysis_date, find_all_score, find_analysis_date};
