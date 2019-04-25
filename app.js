const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect('mongodb+srv://elen:070331mdb!@cluster0-drqh7.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });


//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//     {
//         name: "Pinery Provincial Park1",
//         image: "/images/pinary-park.jpg"
//     }
// ).then(() => console.log('New Campground created'));

// const campgrounds = [
//     { name: "Pinery Provincial Park", image: "/images/pinary-park.jpg" },
//     { name: "Ponderosa Campground", image: "/images/ponderosa-campground.jpg" },
//     { name: "Prospect Hill", image: "/images/prospect-hill.jpg" }
// ]

app.get('/', function (req, res) {
    res.render('landing');
});

app.get('/campgrounds', function (req, res) {
    //get all campgrounds from DB
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds', { campgrounds: allcampgrounds });
        }
    });
});

app.post('/campgrounds', function (req, res) {
    //get data from form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = { name: name, image: image };
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

app.get('/campgrounds/new', function (req, res) {
    res.render('new.ejs');
});

app.listen(3000, function () {
    console.log('Ready!');
});
