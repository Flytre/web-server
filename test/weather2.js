//Invalid inputs: 7e-7, Infinity, "Hello", -Infinity
import https from "https";

const INVALID_INPUT_GENERIC = "Error: Invalid input";
const NOT_IN_US = "Error: Coordinates not in the US";

const options = {
    headers: {
        'User-Agent': 'request'
    }
};

function inAmerica(lat, long) {
    if (long > -127 && long < -58 && 25 < lat && lat < 51)
        return true;
    if (long > -171 && long < -138 && 50 < lat && lat < 72)
        return true;

    return Math.sqrt((lat - 20) ** 2 + (long + 157.45) ** 2) < 5;
}

function getData(lat, long) {
    if (isNaN(lat) || isNaN(long))
        return INVALID_INPUT_GENERIC
    lat = parseFloat(lat.toFixed(4).replace(/0+$/, ""));
    long = parseFloat(long.toFixed(4).replace(/0+$/, ""));

    // if (!inAmerica(lat, long))
    //     return NOT_IN_US;

    let url = "https://api.weather.gov/points/" + lat + "," + long
    console.log(getPage(url))
    return url
}


function getPage(url) {
    https.get(url, options, res => {

        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk;
        });

        res.on('end', () => {
            console.log(rawData)
        });
    }).on('error', function (e) {
        console.error(e);
    });
}

console.log(getData(10.43235324543253, 7e-7))