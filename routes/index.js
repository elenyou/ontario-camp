const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
const User      = require('../models/user');

//===========
//AUTH ROUTES
//===========
router.get('/', (req, res) => {
    res.render('landing');
});


//show register form
router.get("/register", (req, res) => {
    res.render('register');
});

//handle sign up logic
router.post("/register", async (req, res)  =>  {
    let newUser = new User({username: req.body.username});
    try {
         const user = await User.register(newUser, req.body.password);
         passport.authenticate("local")(req, res, () => {
            req.flash('success', "Wellcome!" + user.username);
            res.redirect('/campgrounds');
        });
     } catch(err) {
        req.flash('error', err.message);
        return res.render("register");
     }
});

//show login form
router.get("/login",  (req, res)  =>  {
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
router.get("/logout", (req, res)  =>  {
    req.logout();
    req.flash('success', 'You have been logged out.');
    res.redirect('/campgrounds');
});

module.exports = router;