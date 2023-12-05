const router = require('express').Router();
const { find_score_over_time, find_all_score } = require('../db');

const quality_category = 'Score';

router.route('/score_data').get((req,res) =>{
    const id = req.query.id;
    find_score_over_time(id,quality_category).then(result => {
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

router.route('/score_data').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_score_over_time(id_list,quality_category).then(result => {
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

router.route('/get_all').get((req,res) => {
    const body = req.body;   
    id_list = [];
    find_all_score().then(result => {
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