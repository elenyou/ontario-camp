const express = require('express');
const router  = express.Router();
const Campground = require('../models/campground');
const middleware      = require('../middleware');

//Display a list of all campgrounds (Index Route)
router.get('/', function (req, res) {
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
router.post('/', middleware.isLoggedIn, function (req, res) {
    //Get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, image: image, price: price, description: description, author: author};
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
router.get('/new', middleware.isLoggedIn,  function (req, res) {
    res.render('campgrounds/new');
});

// Shows info about one camp (Show Route)
router.get("/:id",  function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});

//EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership,  function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            res.redirect('campgrounds');
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find + update the correct camp
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect to the show page
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//Remove campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;