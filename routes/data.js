const {
    Router
} = require('express'),
    router = Router(),
    auth = require('../utils/auth')

router.get('/registeredguards', (req, res) => {
    auth.fetchGuards(req, res)
})

router.get('/subscribedclients', (req, res) => {
    auth.fetchClients(req, res)
})

router.get('/clientsCount', (req, res) => {
    auth.countClients(req, res)
})

router.get('/guardsCount', (req, res) => {
    auth.countGuards(req, res)
})

router.get('/incEmpNo', (req, res) => {
    auth.fetchEmpNo(req, res)
})

router.get('/retrieveGuardDataFromFirebase', auth.retrieveGuardDataFromFirebase)

module.exports = router