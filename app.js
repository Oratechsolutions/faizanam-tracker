// main app.js file
var http = require('http')
var multer = require('multer')
var firebase = require('firebase')
// var admin = require("firebase-admin")
var cors = require('cors')

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp({
        serviceAccount: __dirname + '/config/Faizanam-aadbb21b37c0.json',
        databaseURL: 'https://faizanam-211422.firebaseio.com/'
    })
}
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    PORT = process.env.PORT || 5000

var server = http.createServer(app)

exports.server = server

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(cors())
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/images/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({
    storage: storage
});


//setting the view engine to ejs

app.set('view engine', 'ejs')

//use res.render to load up an ejs file view

//main  login page
app.get('/', function (req, res) {
    res.render('pages/index');
});

//main register page
app.get('/register', function (req, res) {
    res.render('pages/register');
});

app.get('/socket', (req, res) => {
    socketServer.addListener('')
})
app.use('/auth', require('./routes/auth'))
app.use('/pages', require('./routes/pages'))
app.use('/data', require('./routes/data'))

server.listen(PORT, () => {
    console.log('Server listening on port 5000')
});