const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const passport       = require('passport');
const session        = require("express-session");
const LocalStrategy  = require('passport-local');
const Campground     = require('./models/campground');
const Comment        = require('./models/comment');
const User           = require('./models/user');
const seedDB         = require('./seeds');

//requiring routes
const commentRoutes      = require("./routes/comments"),
      campgroundRoutes   = require("./routes/campgrounds"),
      indexRoutes        = require("./routes/index")

seedDB();
mongoose.connect('mongodb+srv://elen:070331mdb!@cluster0-drqh7.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('landing');
});

//Passport config
app.use(session({
    secret: "Avengers!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//Display a list of all campgrounds (Index Route)
app.get('/campgrounds', function (req, res) {
    //get all campgrounds from DB
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allcampgrounds});
        }
    });
});

//Add new camp to DB (Create Route)
app.post('/campgrounds', function (req, res) {
    //Get data from form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = { name: name, image: image, description: description };
    //Create a new campground and save DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

//Displays form to make a new camp (New Route)
app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new');
});

// Shows info about one camp (Show Route)
app.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
})

//==============
//Comments Routes
//==============
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
})

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //connect new comment to camp
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//===========
//AUTH ROUTES
//===========

//show register form
app.get("/register", function (req, res) {
    res.render('register');
});

//handle sign up logic
app.post("/register", function (req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect('/campgrounds');
        });
    });
});

//show login form
app.get("/login", function (req, res) {
    res.render('login');
});
//handle login logic
app.post("/login", passport.authenticate('local',
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
});

//add log out logic
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next;
    }
    res.redirect("/login");
}

app.listen(3000, function () {
    console.log('Ready!');
});
