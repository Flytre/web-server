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


const cookieParser = require('cookie-parser')
app.use(cookieParser())

const cookieSession = require('cookie-session')
app.use(cookieSession({
    name: 'supersecretsession',
    keys: ['KLF*&$$$$∫∆•˜', '56∫˚∆¥¨¨øœ´7YUHNBMJKA∂ƒ©˙∆§•∆ç˜˜']
}))

const {AuthorizationCode} = require('simple-oauth2');
app.set('trust proxy', 1) // proxy code for running on director


const ion = {
    id: "TD77KDGm2u29zTCLkSOVuA0ub1CBrHk1i0li08dk",
    secret: "y2MZ0I0VmHDP2EEo1Vos8DuhU0KX0Kk9n2Koy9rbjHSRl1Ur31rl4Fahr9A4ORX5XSN6IwFnCQUTGx1pYSwyDgTjT7PYe2a94fp0rr4aLFdsKScnBWwEaRnWx6XkXmcF",
    uri: "http://127.0.0.1:8080/ion_login"  //CHANGE ON SERVER!
}

const client = new AuthorizationCode({
    client: {
        id: ion.id,
        secret: ion.secret,
    },
    auth: {
        tokenHost: 'https://ion.tjhsst.edu/oauth/',
        authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
        tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
    }
});


const authorizationUri = client.authorizeURL({
    scope: "read",
    redirect_uri: ion.uri
});

// -------------- intermediary login_worker helper -------------- //
async function getIonToken(req, res, next) {
    const options = {
        'code': req.query.code,
        'redirect_uri': ion.uri,
        'scope': 'read'
    };

    try {
        let response = await client.getToken(options);
        res.locals.token = response.token;
        next()
    } catch (error) {
        console.log('Access Token Error', error.message);
        res.sendStatus(502);
    }
}


app.get('/ion_login', [getIonToken], (req, res) => {
    req.session.authenticated = true;
    req.session.token = res.locals.token;
    res.redirect('/');
});


function checkAuthentication(req, res, next) {
    if ('authenticated' in req.session) {
        // the user has logged in
        next()
    } else {
        // the user has not logged in
        res.render('error', {'error': "Not logged in. Go to " + authorizationUri + " to log in."})
    }
}

// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function (req, res) {
    res.render('index');
});


app.get("/login", (req, res) => {


    let username = req.query.username

    if (username === undefined) {
        res.redirect("https://ion.tjhsst.edu/oauth/authorize?response_type=code&client_id=TD77KDGm2u29zTCLkSOVuA0ub1CBrHk1i0li08dk&scope=read&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fion_login")
        return
    }
    req.session.username = username;

    res.redirect("/")
})

app.get("/logout", (req, res) => {
    if ('username' in req.session)
        delete req.session.username;


    if ('authenticated' in req.session)
        delete req.session.authenticated;
    if ('token' in req.session)
        delete req.session.token;

    res.redirect("/")
})


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

app.get('/map', (req, res) => {
    res.render("map_game")
})

const weather = require('./routes/weather.js');
app.use(weather);

const voting = require('./routes/voting.js');
app.use(voting);

const premium = require('./routes/premium.js');
app.use(premium);


const profile = require('./routes/profile.js');
app.use(profile);

const houses = require('./routes/houses.js');
app.use(houses);

const numbers = require('./routes/number.js');
app.use(numbers);
// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

// var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
const listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function () {
    console.log("Express server started");
});