const { Router} = require('express'),
router = Router()


//rendering dashboard pages 

router.get('/home', (req, res) => {
    res.render('pages/home')
})

router.get('/register-guards',(req, res)=>{
    res.render('pages/register-guards')
})

router.get('/register-clients', (req, res)=>{
    res.render('pages/register-clients')
})  

router.get('/view-clients', (req, res) => {
    res.render('pages/view-clients')
})  

router.get('/view-guards', (req, res) => {
    res.render('pages/view-guards')
})  

router.get('/view-you', (req, res) => {
    res.render('pages/view-you')
})  
router.get('/guards-status', (req, res) =>{
    res.render('pages/guards-status')
})
router.get('/admin-status', (req, res) => {
    res.render('pages/admin-status')
})

module.exports = router
