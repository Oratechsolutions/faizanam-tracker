var router = require('express').Router()
var auth = require('../utils/auth')
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({
    storage: storage
});



router.post('/login', (req, res) => {
    auth.Login(req, res)
})

router.post('/register', (req, res) => {

    auth.Register(req, res)
})

router.post('/register-clients', upload.single('client_image'), (req, res) => {
    console.log('-----------------------request-------------------------------')
    console.log(req.file.path)
    auth.addClient(req, res)
})

router.post('/register-guards', upload.single('profile_picture'), (req, res) => {
    console.log('-------------------request----------------')
    console.log(req.file.path)
    auth.addGuard(req, res)
})

router.post('/register-guards-firebase', (req, res) => {
    console.log('-------------------request----------------')
    auth.registerGuard(req, res)
})

router.post('/home', (req, res) => {
    auth.countClients(req, res)
})

module.exports = router