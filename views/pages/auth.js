var errors = req.validationErrors();

if (errors) {
    res.render('users/register', {
        errors: errors
    });
} else {
    console.log("Started 1...");
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error, userData) {
        console.log("Started 2...");
        if (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            req.flash('error_msg', 'Registration Failed. Make sure all fields are properly filled.' + error.message);
            res.redirect('/users/register');
            console.log("Error creating user: ", error);
        } else {
            console.log("Successfully created");
            console.log("Successfully created user with uid:", userData.uid);
            var user = {
                uid: userData.uid,
                email: email,
                username: username
            }

            var userRef = firebase.database().ref('users/');
            userRef.push().set(user);

            req.flash('success_msg', 'You are now registered and can login');
            res.redirect('/users/login');
        }

    });
}