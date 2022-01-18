const express = require('express');
const router = express.Router({strict: true})

//LOG IN ==> ENCRYPTED, LOG IN ==> UNLIMITED PLAYS

router.get("/premium", (req, res) => {

    if (!('premium_visits' in req.session)) {
        req.session.premium_visits = 0
    } else {
        req.session.premium_visits += 1
    }

    if ("username" in req.session || req.session.premium_visits < 5)
        res.render('premium')
    else
        res.render('error', {error: "You have already used all trial premium tokens. Please buy premium to continue accessing this content."})
})

module.exports = router;