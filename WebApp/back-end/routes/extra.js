const router = require('express').Router();
const { find_single_data, find_extra_data } = require('../db');

const quality_category = 'Extra';

router.route('/extra_data').get((req, res) =>{
    const id = req.query.id;
    find_extra_data(id).then(result => {
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

router.route('/extra_data').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_extra_data(id_list).then(result => {
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