const router = require('express').Router();

router.route('/availability').get((req,res) =>{
    const id = req.query.id;
    req.db.collection('quality_analysis_data').find(
        { 'kg_id': id },
        {
            projection:{
                _id: 0, 
                kg_id: 1,
                kg_name: 1,
                analysis_date: 1,
                Accessibility: { $arrayElemAt: ['$Accessibility', 0] }, 
            }
        },
    ).toArray()
    .then(result => {
        if(result.length > 0)
            res.json(result);
        else
            res.status(404).json({ error: 'No data found' });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error during the aggregation: '+ err);
    })
})

router.route('/licensing').get((req, res) =>{
    const id = req.query.id;
    req.db.collection('quality_analysis_data').findOne(
        { 'kg_id': id },
        {
            projection: {
                _id: 0, 
                kg_id: 1,
                kg_name: 1,
                analysis_date: 1,
                Accessibility: { $arrayElemAt: ['$Accessibility', 1] }, 
            },
            sort: { analysis_date: -1 }
        }
    )
    .then(result => {
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