const firebase = require("firebase")
const db = require('../config/dbconnect')
const server = require('../app').server
const WebSocket = require('websocket').server
const socketServer = new WebSocket({
    httpServer: server
})

socketServer.on('connect', function (conn) {
    conn.on('message', function (data) {
        console.log(data)
    })
    console.log('Connected', socketServer.connections)
})
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function Login(req, res) {
    db.query(`select * from users where email=${req.body.user_email} and password=${req.body.user_password}`, (data) => {
        if (data.length < 0) {
            res.redirect('/?unauthorized')
        }
        // start session
        res.redirect('/pages/home')
    })
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function Register(req, res) {
    let credentials = {
        name: req.body.user_name,
        phone: req.body.user_phone,
        email: req.body.user_email,
        password: req.body.user_password,
        id_number: req.body.user_id_number
    }
    db.query(`insert into users set ?`, credentials, (result) => {
        (result.affectedRows == 1) ? res.redirect('/?registeredsuccessfully'): res.end(JSON.stringify({
            message: 'failed'
        }))
    })
}


/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

async function fetchEmpNo() {
    let employees = await db.queryAsync('select emp_number from security_guards order by emp_number desc').catch(err => console.log(err))
    if (employees.length < 1)
        return
    return Number(employees[0]['emp_number'].split('-')[1])
}

async function fetchClientId() {
    let clients = await db.queryAsync('select client_tracker_id from client_companies order by client_tracker_id desc').catch(err => console.log(err))
    if (clients.length < 1)
        return
    return Number(clients[0]['client_tracker_id'].split('-')[1])
}

async function addGuard(req, res) {
    let empnumber = await fetchEmpNo(),
        newEmpNumber = 'EMP-00' + (empnumber + 1)

    let credentials = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        id_number: req.body.id_number,
        dob: req.body.dob,
        profile_picture: req.file.path,
        emp_number: newEmpNumber
    }
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    })

    db.query(`insert into security_guards set ?`, credentials, (result) => {
        (result.affectedRows == 1) ? res.redirect('/pages/register-guards?registeredsuccessfully'): res.end(JSON.stringify({
            message: 'failed creating new guard account'
        }))
    })
}

function registerGuard(phone, email, id_number, newEmpNumber) {
    // A post entry.
    var postData = {
        Phone: phone,
        Email: email,
        ID_Number: id_number,
        TrackerID: newEmpNumber,
        starCount: 0
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('Guards').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/Guards/' + newPostKey] = postData;
    // updates['/guards-tracking/' + uid + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function addClient(req, res) {
    let client_id = await fetchClientId(),
        newClientId = 'CLI-00' + (client_id + 1)
    let credentials = {
        client_name: req.body.client_name,
        client_industry: req.body.client_industry,
        client_email: req.body.client_email,
        client_phone: req.body.client_phone,
        client_location: req.body.client_location,
        client_website: req.body.client_website,
        client_image: req.file.path,
        client_tracker_id: newClientId

    }
    db.query(`insert into client_companies set ?`, credentials, (result) => {
        (result.affectedRows == 1) ? res.redirect('/pages/register-clients?newclientadded'): res.end(JSON.stringify({
            message: 'failed registering client'
        }))
    })
}



/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function fetchGuards(req, res) {
    db.query(`select * from security_guards order by time_registered desc limit 3`, (results) => {
        res.end(JSON.stringify(results))
    })
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function fetchClients(req, res) {
    db.query(`select * from client_companies order by time_registered desc limit 3`, (results) => {
        res.end(JSON.stringify(results))
    })
}
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function countClients(req, res) {
    db.query(`select count(*) as clientsCount from client_companies`, (results) => {
        res.end(JSON.stringify(results))
    })

}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function countGuards(req, res) {
    db.query(`select count(*) as guardsCount from security_guards`, (results) => {
        res.end(JSON.stringify(results))
    })
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function retrieveGuardDataFromFirebase(req, res) {
    let data = await (function () {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/raw-locations/').on('value', snap => resolve(snap))
        })
    })().catch(err => console.log(err))
    console.log(data)
    res.end(JSON.stringify(data))
}


module.exports = {
    Login,
    Register,
    addGuard,
    addClient,
    fetchGuards,
    fetchClients,
    countClients,
    countGuards,
    fetchEmpNo,
    fetchClientId,
    registerGuard,
    retrieveGuardDataFromFirebase
}