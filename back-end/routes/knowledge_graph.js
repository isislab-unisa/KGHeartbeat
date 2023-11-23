const router = require('express').Router();
const { searchKG, find_selected_analysis, searchActiveKG, find_most_recent_analysis_date, find_analysis_date } = require('../db');
const { parse, unparse } = require('papaparse');
const fs = require('fs');
const path = require('path');
const { flat_data, filterUniqueObjects,readFileContent } = require('../utils');
const archiver = require('archiver');
const { json } = require('express');

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
    const sparql = req.query.sparql;
    if(!sparql){
        searchKG(keywords).then(result => {
            if(result)
                res.json(result);
            else
                res.status(404).json({ error: 'No data found' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error during the aggregation: ' + err);
        });
    } else if(sparql === 'online'){
        find_most_recent_analysis_date().then(most_recent_analysis =>{
            searchActiveKG(keywords,most_recent_analysis).then(result => {
                if(result)
                    res.json(result);
                else
                    res.status(404).json({ error: 'No data found' });
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error during the aggregation: ' + err);
        });
    }
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

router.route('/get_analysis_date').get((req,res) => {
    find_analysis_date().then(result => {
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

router.route('/download').post((req,res) => {
    const body = req.body;   
    const analysis_date = body.analysis_date;
    find_analysis_date().then(result => {
        if(result.length > 0){
            const date_list = result.map(obj => obj.analysis_date);
            const start_date = analysis_date[0];
            const end_date = analysis_date[1];
            const filtered_list = date_list.filter(date => date >= start_date && date <= end_date);
            const archive = archiver('zip', { zlib: { level: 9 } });
            let file_to_zip = []
            for(let i = 0; i<filtered_list.length; i++){
                filename_csv = `${filtered_list[i]}.csv`
                filename_log = `${filtered_list[i]}.log`
                file_to_zip.push(filename_csv)
                file_to_zip.push(filename_log)
            }
            if(file_to_zip.length > 0){
                try{
                    file_to_zip.forEach((file) => {
                        const file_path = path.join(__dirname, '../analysis_data', file);
                        if(fs.existsSync(file_path)){
                            archive.append(fs.createReadStream(file_path), {name: file});
                        }
                    })
        
                    archive.pipe(res)
        
                    archive.finalize();
                } catch {
                    console.error(err);
                    res.status(500).send('Error during the archive creation: ' + err);
                }
            } else {
                res.status(404).json({ error: 'No data found' });
            }
        }else{
            es.status(404).json({ error: 'No data found' });
        }
    })

})

module.exports = router;