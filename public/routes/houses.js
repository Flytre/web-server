const express = require('express');
const router = express.Router({strict: true})
const {pool} = require('./oauth');


function authenticate(req, res, next) {
    if ("authenticated" in req.session) {
        next()
    } else {
        res.redirect("https://ion.tjhsst.edu/oauth/authorize?response_type=code&client_id=TD77KDGm2u29zTCLkSOVuA0ub1CBrHk1i0li08dk&scope=read&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fion_login")
    }
}


function getSqlData(req, res, next) {
    let cmd = `
        SELECT *
        from houses;
        SELECT *
        from house_members;
        SELECT *
        from house_points;
    `;
    pool.query(cmd, function (error, results, fields) {
        if (error)
            throw error;
        let houses = {};
        results[0].forEach(row => houses[row.id] = row.name);

        let members = {};
        results[1].forEach(row => members[row.id] = row.name);

        let data = {};

        for (const [key, value] of Object.entries(houses).sort()) {
            data[value] = {}
        }

        results[2].forEach(row => {
            let house = houses[row.house]
            let member = members[row.member]
            data[house][member] = row.points;
        });


        res.locals.house_data = data;
        next();
    })
}


function getHousePoints(req, res, next) {
    let house_points = {}
    for (const [house, members] of Object.entries(res.locals.house_data)) {
        let sum = 0;
        for (const [member, points] of Object.entries((members))) {
            sum += points;
        }
        house_points[house] = sum
    }
    res.locals.house_points = house_points;
    next();
}

router.get("/houses", [authenticate, getSqlData, getHousePoints], (req, res) => {
    let params = {}
    params.houses = res.locals.house_data;
    params.house_points = res.locals.house_points;
    res.render("houses", params);
})


router.post("/houses/add_subject", [authenticate, getPostData, addUserSql, returnUpdatedMembership])

router.post("/houses/modify_points", [authenticate, getPostData, updatePointsSql, returnUpdatedPoints])

function getPostData(req, res, next) {
    let body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        const post = JSON.parse(body);
        if ("authenticated" in req.session) {
            res.locals.post = post;
            next()
        }
    });
}

function addUserSql(req, res, next) {
    const post = res.locals.post;
    let cmd = `
         CALL modify_points('${post.house}', '${post.member}', 0, false);
    `;
    pool.query(cmd, function (error, results, fields) {
        if (error)
            throw error;
        next();
    })
}

function updatePointsSql(req, res, next) {
    const post = res.locals.post;
    let cmd = `
         CALL modify_points('${post.house}', '${post.member}', ${post.points}, true);
    `;
    pool.query(cmd, function (error, results, fields) {
        if (error)
            throw error;
        next();
    })
}

function returnUpdatedMembership(req, res, next) {
    getSqlData(req, res, () => {
        getHousePoints(req, res, () => {
            const house_data = res.locals.house_data;
            const post = res.locals.post;

            if (!house_data.hasOwnProperty(post.house)) {
                res.json({"status": "fail"})
            } else {
                res.json({"status": "success"})
            }
            res.status(200);
        })
    })
}

function addSubjectSql(req, res, next) {

}

function returnUpdatedPoints(req, res) {
    getSqlData(req, res, () => {
        getHousePoints(req, res, () => {
            const house_data = res.locals.house_data;
            const post = res.locals.post;
            const points = house_data[post.house][post.member];
            const house_points = res.locals.house_points;
            res.json({"points": points, "house_points": house_points[post.house]});
            res.status(200);
        })
    })
}

module.exports = router;