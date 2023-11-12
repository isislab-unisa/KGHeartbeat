const router = require('express').Router();
const { searchKG, find_selected_analysis } = require('../db');
const { parse, unparse } = require('papaparse');
const { flat_data, filterUniqueObjects } = require('../utils');

router.route('/').get((req, res) => {
    const pipeline = [
        {
            $group: {
                '_id': "$kg_id",
                first_document: { $first: "$$ROOT" }
            }
        },
        {
            $replaceRoot: { newRoot: "$first_document" }
        },
        {
            $project: {
                _id: 0,
                kg_id: 1,
                kg_name: 1,
                Believability: { $arrayElemAt: ["$Trust.Believability", 0] }  
             }
        }
    ];
    req.db.collection('quality_analysis_data').aggregate(pipeline).toArray().then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error during the aggregation: '+ err);
    })
});


router.route('/search').get((req, res) => {
    const keywords = req.query.q;
    searchKG(keywords).then(result => {
        if(result.length > 0)
            res.json(result);
        else
            res.status(404).json({ error: 'No data found' });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error during the aggregation: ' + err);
    });
})

router.route('/export_analysis').post((req,res) => {
    const body = req.body;   
    const id_list = body.id;
    const start_date = body.start_date;
    const end_date = body.end_date;
    const quality_dimensions = body.dimensions;
    let new_results = []
    find_selected_analysis(id_list,start_date,end_date,quality_dimensions).then(result => {
        if(result.length > 0){
            for(let i = 0; i< result.length; i++){  
                    const quality_category = result[i];
                    let new_obj = {}
                    new_obj['kg_name'] = result[i]['kg_name']
                    new_obj['kg_id'] = result[i]['kg_id']
                    new_obj['analysis_date'] = result[i]['analysis_date']
                    for(key in quality_category){
                        if(result[i] != undefined){
                        if(typeof result[i][key] === 'object'){
                            const dimension_in_category = result[i][key]
                            for(let k = 0; k<dimension_in_category.length; k++){
                                for(key in dimension_in_category[k]){
                                    for(let u = 0; u<quality_dimensions.length; u++){
                                        if(key.toLowerCase() === quality_dimensions[u].toLowerCase()){
                                            new_obj[key] = dimension_in_category[k][key]
                                            new_results.push(new_obj)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            final_obj = filterUniqueObjects(new_results)
            flatten_obj = flat_data(final_obj,quality_dimensions);
            
            const csv_string = unparse(flatten_obj)
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=KGHeartbeat_analysis.csv');

            res.status(200).send(csv_string);
        }
        else
            res.status(404).json({ error: 'No data found' });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error during the aggregation: ' + err);
    });
})

module.exports = router;