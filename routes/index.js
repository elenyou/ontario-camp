const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
const User      = require('../models/user');

//===========
//AUTH ROUTES
//===========
router.get('/', function (req, res) {
    res.render('landing');
});

//show register form
router.get("/register", function (req, res) {
    res.render('register');
});

//handle sign up logic
router.post("/register", function (req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash('success', "Wellcome!" + user.username);
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render('login');
});
//handle login logic
router.post("/login", passport.authenticate('local',
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
});

//add log out logic
router.get("/logout", function (req, res) {
    req.logout();
    req.flash('success', 'You have been logged out.');
    res.redirect('/campgrounds');
});

module.exports = router;