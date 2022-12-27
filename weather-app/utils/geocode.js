const request = require('request');

const geoCode = (address = 'Balrampur', callback) => {
    const geoUrl = `https://api.tomtom.com/search/2/geocode/%22${encodeURIComponent(address)}%22.json?key=h8AXan8nZoWSnkFOF8XvpTCGrfTEtgWX`;
    
    request({ url: geoUrl, json: true }, (error, response) => {
        if(error){
            console.log('Error!!!')
        } else {
            const { lat: lat, lon: long } = response.body?.results?.[0].position;
            callback(lat.toString(), long.toString())
        }
    })
}

module.exports = geoCode;