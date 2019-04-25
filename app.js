const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seedDB = require('./seeds');


seedDB();
mongoose.connect('mongodb+srv://elen:070331mdb!@cluster0-drqh7.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));



app.get('/', function (req, res) {
    res.render('landing');
});

//Display a list of all campgrounds (Index Route)
app.get('/campgrounds', function (req, res) {
    //get all campgrounds from DB
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { campgrounds: allcampgrounds });
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
    res.render('new');
});

// Shows info about one camp (Show Route)
app.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render('show', { campground: foundCampground });
        }
    });
})

app.listen(3000, function () {
    console.log('Ready!');
});
