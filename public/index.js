#!/usr/bin/nodejs

// initialize express and app class object
const express = require('express');
const app = express();

// initialize handlebars templating engine
const hbs = require('hbs')
app.set('view engine', 'hbs')

// initialize the built-in library 'path'
const path = require('path')
console.log(__dirname)
app.use(express.static(path.join(__dirname, 'static')))

// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/labs', function (req, res) {
    res.render('labs');
});
app.get('/madlib_form', function (req, res) {
    res.render('formtemplate');
});

app.get('/madlib', function (req, res) {

    const {name, city, animal, activity, number, predator, image} = req.query;

    const params = {
        'name': name,
        'place': city,
        'animal': animal,
        'activity': activity,
        'number': number,
        'predator': predator,
        'image': image
    };

    res.render('madlib', params);
});


const weather = require('./routes/weather.js');
app.use(weather);

const voting = require('./routes/voting.js');
app.use(voting);

const premium = require('./routes/premium.js');
app.use(premium);


const numbers = require('./routes/number.js');
app.use(numbers);
// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

// var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
const listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function () {
    console.log("Express server started");
});