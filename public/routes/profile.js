const express = require('express');
const router = express.Router({strict: true})
const {storeProfileData, getDatabaseNickname, getImage, pool} = require('./oauth');


function authenticate(req, res, next) {
    if ("authenticated" in req.session) {
        next()
    } else {
        res.redirect("https://ion.tjhsst.edu/oauth/authorize?response_type=code&client_id=TD77KDGm2u29zTCLkSOVuA0ub1CBrHk1i0li08dk&scope=read&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fion_login")
    }
}

router.get("/profile", [authenticate, storeProfileData, getDatabaseNickname, getImage], (req, res) => {
    if ("authenticated" in req.session) {
        const profile = res.locals.profile;
        const stored_nickname = res.locals.stored_nickname;
        let obj = {
            "image": res.locals.image_url,
            "display_name": profile.display_name,
            "full_name": profile.full_name,
            "email": profile.tj_email,
            "phone": profile.phones.length > 0 ? profile.phones[0] : "N/A",
            "year": profile.graduation_year,
            "counselor": profile.counselor.full_name,
            "nickname": stored_nickname
        }

        res.render("profile", obj)
    } else {
        res.redirect("https://ion.tjhsst.edu/oauth/authorize?response_type=code&client_id=TD77KDGm2u29zTCLkSOVuA0ub1CBrHk1i0li08dk&scope=read&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fion_login")
    }
})

router.post("/nickname_change", authenticate, storeProfileData, onNicknamePosted, saveNickname)

function onNicknamePosted(req, res, next) {
    let body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        const post = JSON.parse(body);
        const nickname = post.nickname;

        if ("authenticated" in req.session) {
            res.locals.nickname = nickname;
            next()
        }
    });
}

function saveNickname(req, res) {

    let id = res.locals.profile.ion_username;
    let nick = res.locals.nickname;

    if (nick === undefined)
        nick = "";

    let cmd = `
        INSERT IGNORE INTO ion
        VALUES ('${id}', '${nick}', NULL);

        UPDATE ion
        SET nickname = '${nick}'
        WHERE id = '${id}';
    `;
    res.sendStatus(200);

    pool.query(cmd, function (error, results, fields) {
        if (error) throw error;
    })
}

router.get("/profile_test", [authenticate, storeProfileData], (req, res) => {
    getDatabaseNickname(req, res, null);
    res.render("error")
})

module.exports = router;