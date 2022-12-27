const request = require('request');

const geoCode = (address = 'Balrampur', callback) => {
    const geoUrl = `https://api.tomtom.com/search/2/geocode/%22${encodeURIComponent(address)}%22.json?key=h8AXan8nZoWSnkFOF8XvpTCGrfTEtgWX`;
    console.log(address)
    request({ url: geoUrl, json: true }, (error, response) => {
        if(error){
            console.log('Error!!!')
        } else {
            const { lat, lon } = response?.body?.results?.[0]?.position ?? {lat: 27.4176, lon: 82.1696};
            console.log(response?.body?.results?.[0]?.position.lat)
            console.log(lat, lon)
            callback(lat, lon)
        }
    })
}

module.exports = geoCode;