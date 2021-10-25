const express = require('express');
const router = express.Router({strict: true})

const cookieParser = require('cookie-parser')
router.use(cookieParser())

const cookieSession = require('cookie-session')
router.use(cookieSession({
    name: 'supersecretsession',
    keys: ['KLF*&$$$$∫∆•˜', '56∫˚∆¥¨¨øœ´7YUHNBMJKA∂ƒ©˙∆§•∆ç˜˜']
}))

//LOG IN ==> ENCRYPTED, LOG IN ==> UNLIMITED PLAYS

router.get("/login", (req, res) => {

    let username = req.query.username

    if (username === undefined) {
        res.render('error', {error: "No username specified"})
        return
    }
    req.session.username = username;

    res.redirect("/")
})


router.get("/logout", (req, res) => {
    if ('username' in req.session)
        delete req.session.username;

    res.redirect("/")
})

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

router.get("/username", (req, res) => {
    res.json({
        "username": req.session.username
    })
})