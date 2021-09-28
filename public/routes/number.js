const express = require('express');
const router = express.Router({strict: true})

router.get("/:number", function (req, res) {

    let query = req.query.num_facts;
    let format = req.query.format;
    if (query === undefined || isNaN(query))
        query = 3
    let facts = []
    if(req.params.number === Infinity || req.params.number === -Infinity) {
        facts.push(req.params.number + " is infinite.")
    }
    else if (!isNaN(req.params.number)) {
        const num = parseFloat(req.params.number);
        if (query > 0)
            facts.push(num + ' is a number');
        if (query > 1)
            facts.push(num + " is less than " + (num + 1))
        if (query > 2)
            facts.push(num + " is greater than " + (num - 1))
        if (query > 3)
            facts.push(num + " is not equal to " + (num - 1000))
    } else {
        facts.push(req.params.number + " is not a number")
    }

    const params = {
        'value': req.params.number,
        'facts': facts
    }

    if (format === 'json') {
        res.send({
            "facts" : facts
        })
    } else
        res.render('numbers', params)
})

module.exports = router;