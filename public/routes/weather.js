const express = require('express');
const https = require("https");
const router = express.Router({strict: true})


const options = {
    headers: {
        'User-Agent': 'request'
    }
};


router.get("/weather_form", (req, res) => {
    res.render("weather_form");
})


router.get("/getweather", getRawData, useForecast)


function getRawData(req, res, next) {
    let lat = req.query.lat, long = req.query.long;

    if (isNaN(lat) || isNaN(long)) {
        res.render('error', {
            "error": "Invalid input: " + lat + " " + long + ""
        })
        return;
    }
    lat = parseFloat(parseFloat(lat).toFixed(4).replace(/0+$/, ""));
    long = parseFloat(parseFloat(long).toFixed(4).replace(/0+$/, ""));

    let url = "https://api.weather.gov/points/" + lat + "," + long

    https.get(url, options, httpsCallback => {

        let rawData = '';
        httpsCallback.on('data', chunk => {
            rawData += chunk;
        });

        httpsCallback.on('end', () => {

            let json = JSON.parse(rawData)

            if (json.status !== undefined && (json.status === 404 || json.status === 500)) {
                res.render('error', {
                    "error": "Point not in US: " + lat + " " + long + ""
                });
                return;
            }


            let location = json.properties.relativeLocation.properties

            res.locals.place = location.city + ", " + location.state;
            res.locals.link = json.properties.forecastHourly;
            next();
        });
    }).on('error', function (e) {
        console.error(e);
    });
}

function useForecast(req, res, next) {
    https.get(res.locals.link, options, httpsCallback => {
        let rawData = '';
        httpsCallback.on('data', chunk => {
            rawData += chunk;
        });

        httpsCallback.on('end', () => {
            let json = JSON.parse(rawData).properties.periods

            let formattedData = []

            for (let dp in json) {
                let obj = json[dp]
                let formatted = {}
                formatted.time = formatDate(obj.startTime)
                formatted.temperature = obj.temperature + "°" + obj.temperatureUnit
                formatted.timeOfDay = obj.isDaytime ? "Daytime" : "Nighttime"
                formatted.wind = obj.windSpeed + " " + obj.windDirection
                formattedData.push(formatted)
            }
            const params = {
                'data': formattedData,
                'place': res.locals.place
            }

            res.render('weather', params)
        });
    });
}

function formatDate(value) {
    let date = new Date(Date.parse(value))
    return date.toLocaleString('en-US', {
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
    })
}


module.exports = router;