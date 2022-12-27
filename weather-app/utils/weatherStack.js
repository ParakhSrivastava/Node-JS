const request = require('request');

const weatherStack = (lat = "27.4176", long = "82.1696") => {
    const url = `http://api.weatherstack.com/current?access_key=9ccc85064117f869d4ae9724a12ae9bd&query=${lat},${long}`;

    request({ url, json: true }, (error, response) => {
        if(error){
            console.log('Error!!!')
        } else {
            console.log(`Forecast of ${response.body?.location.name} is ${response.body?.current.weather_descriptions[0]}`)
        }
    })
}

module.exports = weatherStack;