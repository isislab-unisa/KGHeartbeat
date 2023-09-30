const router = require('express').Router();

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
                _id: 0, // Per escludere il campo _id dal risultato
                kg_id: 1 // Per includere il campo kg_id nel risultato
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

module.exports = router;