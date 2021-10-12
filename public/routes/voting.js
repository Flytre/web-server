const express = require("express");
const router = express.Router({strict: true})
const mysql = require('mysql2');

// -------------- mysql initialization -------------- //
// USE PARAMETERS FROM DIRECTOR DOCS!!!
const sql_params = {
    connectionLimit: 10,
    user: process.env.DIRECTOR_DATABASE_USERNAME,
    password: process.env.DIRECTOR_DATABASE_PASSWORD,
    host: process.env.DIRECTOR_DATABASE_HOST,
    port: process.env.DIRECTOR_DATABASE_PORT,
    database: process.env.DIRECTOR_DATABASE_NAME
};

const pool = mysql.createPool(sql_params);

router.get('/voting_result', ((req, res) => {


    getVotingData((data) => {
        let dog = req.query.dog;
        if (dog !== undefined) {
            dog = dog[0].toUpperCase() + dog.slice(1);
        }
        const labels = data.map(r => r.name)
        if (dog !== undefined && labels.includes(dog)) {
            changeVote(dog, () => {
                getVotingData((data) => {
                    displayResultScreen(res, data)
                })
            })
        } else {
            displayResultScreen(res, data)
        }

    })
}))

function displayResultScreen(res, data) {
    const labels = data.map(r => r.name)
    const graphData = {
        labels: labels,
        datasets: [{
            label: "Votes",
            data: data.map(r => r.votes),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)'
            ],
            borderWidth: 1,
            minBarLength: 0.3
        }]
    }

    const graphConfig = {
        type: 'bar',
        data: graphData,
        options: {
            plugins: {
                legend: false,
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            },
        },
    }
    res.render("voting_result", {"test": "test", "graphConfig": JSON.stringify(graphConfig)})
}


function getVotingData(next) {
    let cmd = "SELECT * FROM puppies;"
    pool.query(cmd, function (error, results, fields) {
        if (error) throw error;
        next(results.map(r => {
            return {name: r.name, votes: (r.upvotes - r.downvotes)}
        }))
    })
}

function changeVote(name, next, value = 1) {
    let cmd = "UPDATE puppies SET upvotes = upvotes + " + value + " WHERE name = \"" + name + "\"";
    pool.query(cmd, function (error, results, fields) {
        if (error) throw error;
        console.log()
        next()
    })
}


router.get('/voting', ((req, res) => {
    res.render('voting')
}))


module.exports = router;