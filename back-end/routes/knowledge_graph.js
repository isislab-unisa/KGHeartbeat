const router = require('express').Router();
const { searchKG } = require('../db');

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
                kg_name: 1
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

module.exports = router;