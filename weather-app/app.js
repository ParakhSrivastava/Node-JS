const geoCode = require('./utils/geocode');
const weatherStack = require('./utils/weatherStack');

geoCode('New Delhi', (lat, long) => {
    weatherStack(lat, long)
})