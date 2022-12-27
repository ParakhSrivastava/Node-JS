// it's a function
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geoCode = require('./utils/geocode');
const weatherStack = require('./utils/weatherStack');

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();

// hbs setup (dynamic templates)
app.set('view engine', 'hbs')

// setting custom VIEWS directory (by default NODE will always search for 'views' directory)
app.set('views', viewsPath)

hbs.registerPartials(partialsPath)

// to import static files by giving path (by default loads index.html)
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir))

// Loading HBS file 
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Parakh'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Parakh'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Parakh'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "Address not provided"
        })
    }

    geoCode(req.query.address, (lat, long) => {
        weatherStack(lat, long, (result) => {
            return res.send({
                address: result
            })
        })
    })
})

// for demo of query string access from req
app.get('/products', (req, res) => {
    console.log(req.query);

    if(!req.query.search){
        return res.send({
            error: "Search term must be there"
        })
    }

    return res.send({
        products: []
    })
})

// special matching can be handled as well
app.get('/help/*', (req, res) => {
    res.render('404', {
        error: 'Help Article NOT FOUND!',
        name: 'Parakh'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        error: 'NOT FOUND!',
        name: 'Parakh'
    })
})

app.listen(3000, () => {
    console.log("App Started!!!")
})