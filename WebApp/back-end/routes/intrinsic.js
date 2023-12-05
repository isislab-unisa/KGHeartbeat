const router = require('express').Router();
const { find_data_over_time } = require('../db');

const quality_category = 'Intrinsic';

router.route('/accuracy').get((req,res) =>{
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

router.route('/accuracy').post((req,res) => {
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

router.route('/consistency').get((req,res) =>{
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

router.route('/consistency').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_data_over_time(id_list,quality_category,1).then(result => {
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

router.route('/conciseness').get((req,res) =>{
    const id = req.query.id;
    find_data_over_time(id,quality_category,2).then(result => {
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

router.route('/conciseness').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_data_over_time(id_list,quality_category,2).then(result => {
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
