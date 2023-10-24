const router = require('express').Router();
const { find_single_data, find_data_over_time } = require('../db');

const quality_category = 'Contextual';

router.route('/completeness').get((req,res) =>{
    const id = req.query.id;
    find_data_over_time(id,quality_category,0).then(result => {
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

router.route('/amount_of_data').get((req,res) =>{
    const id = req.query.id;
    find_data_over_time(id,quality_category,1).then(result => {
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

router.route('/amount_of_data').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_data_over_time(id_list,quality_category,0).then(result => {
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

module.exports = router;