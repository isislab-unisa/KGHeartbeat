const router = require('express').Router();
const { find_single_data, find_data_over_time } = require('../db');

const quality_category = 'Representational';


router.route('/representational_conciseness').get((req,res) =>{
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

router.route('/representational_conciseness').post((req,res) => {
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

router.route('/representational_consistency').get((req, res) =>{
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

router.route('/representational_consistency').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_single_data(id_list,quality_category,1).then(result => {
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

//TODO: add routes to get only the numlabel variations over time ?
router.route('/understandability').get((req, res) =>{
    const id = req.query.id;
    find_single_data(id,quality_category,2).then(result => {
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

router.route('/understandability').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_single_data(id_list,quality_category,2).then(result => {
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

//TODO: add routes to get only the nblank_nodes variations over time ?
router.route('/interpretability').get((req, res) =>{
    const id = req.query.id;
    find_single_data(id,quality_category,3).then(result => {
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

router.route('/interpretability').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_single_data(id_list,quality_category,3).then(result => {
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

router.route('/versatility').get((req, res) =>{
    const id = req.query.id;
    find_single_data(id,quality_category,4).then(result => {
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

router.route('/versatility').post((req,res) => {
    const body = req.body;   
    id_list = body.id;
    find_single_data(id_list,quality_category,4).then(result => {
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