const router = require('express').Router();
const { find_single_data } = require('../db');

const quality_category = 'Dataset dynamicity';


router.route('/currency').get((req, res) =>{
    const id = req.query.id;
    find_single_data(id,quality_category,0).then(result => {
        if(result)
            res.json(result);
        else
            res.status(404).json({ error: 'No data found' });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error during the aggregation: ' + err);
    });
});

router.route('/volatility').get((req, res) =>{
    const id = req.query.id;
    find_single_data(id,quality_category,1).then(result => {
        if(result)
            res.json(result);
        else
            res.status(404).json({ error: 'No data found' });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error during the aggregation: ' + err);
    });
});


module.exports = router;