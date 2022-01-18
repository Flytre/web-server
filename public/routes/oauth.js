let https = require('https')
const mysql = require('mysql2');
const fs = require('fs');
const request = require('request');
const path = require("path");

const sql_params = {
    connectionLimit: 10,
    user: process.env.DIRECTOR_DATABASE_USERNAME,
    password: process.env.DIRECTOR_DATABASE_PASSWORD,
    host: process.env.DIRECTOR_DATABASE_HOST,
    port: process.env.DIRECTOR_DATABASE_PORT,
    database: process.env.DIRECTOR_DATABASE_NAME,
    multipleStatements: true
};

const pool = mysql.createPool(sql_params);


function storeProfileData(req, res, next) {
    let access_token = req.session.token.access_token;
    let profile_url = 'https://ion.tjhsst.edu/api/profile?format=json&access_token=' + access_token;

    https.get(profile_url, function (response) {

        let rawData = '';
        response.on('data', function (chunk) {
            rawData += chunk;
        });

        response.on('end', function () {
            res.locals.profile = JSON.parse(rawData);
            next();
        });

    }).on('error', function (err) {
        next(err)
    });
}


function getIonSqlData(req, res, callback) {
    let id = res.locals.profile.ion_username;
    let cmd = `SELECT *
               FROM ion
               WHERE id = '${id}'`;
    pool.query(cmd, function (error, results, fields) {
        if (error) throw error;
        callback(results)
    })
}

function getDatabaseNickname(req, res, next) {
    getIonSqlData(req, res, (results) => {
        if (results.length > 0)
            res.locals.stored_nickname = results[0]["nickname"];
        else
            res.locals.stored_nickname = "N/A";
        next();
    })
}

function getImage(req, res, next) {

    function afterSaved(results) {
        res.locals.image_url = results[0].image.replace('static/', '')
        next();
    }

    getIonSqlData(req, res, (results) => {
        if (results.length < 1 || results[0].image === null) {
            saveImage(req, res, () => {
                getIonSqlData(req, res, (results) => {
                    afterSaved(results);
                })
            });
        } else {
            afterSaved(results);
        }
    })
}


function saveImage(req, res, callback) {
    let access_token = req.session.token.access_token;
    let url = res.locals.profile.picture + "&access_token=" + access_token;
    let id;
    let loc;
    let user_id = res.locals.profile.ion_username;
    do {
        id = makeId(14);
        loc = "static/img/uploads/" + id + ".jpg";
    } while (fs.existsSync(loc));
    request.head(url, function (err, res, body) {
        request(url).pipe(fs.createWriteStream(path.join(process.cwd(), loc))).on('close', () => {

            let cmd = `UPDATE ion
                       SET image = '${loc}'
                       WHERE id = '${user_id}'`
            pool.query(cmd, function (error, results, fields) {
                if (error)
                    throw error;
                callback()
            })
        });
    });
}

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            characters.length));
    }
    return result;
}

module.exports.pool = pool
module.exports.storeProfileData = storeProfileData
module.exports.getDatabaseNickname = getDatabaseNickname
module.exports.getImage = getImage