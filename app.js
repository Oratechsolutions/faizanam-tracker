// main app.js file

var multer = require('multer');
var firebase = require("firebase").initializeApp({
    databaseURL: "https://tracker-project-c8401.firebaseio.com",
    serviceAccount: "./service-account.json"
});
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    PORT = process.env.PORT || 5000


app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

//setting the view engine to ejs

app.set('view engine', 'ejs');

//use res.render to load up an ejs file view

//main  login page
app.get('/', function (req, res) {
    res.render('pages/index');
});

//main register page
app.get('/register', function (req, res) {
    res.render('pages/register');
});

app.use('/auth', require('./routes/auth'))
app.use('/pages',require('./routes/pages'))
app.use('/data',require('./routes/data'))

app.listen(PORT, () => {
    console.log('Server listening on port 5000')
});
