const express = require("express");
//mergeParams: true used to merge params from campground & comments together
const router  = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware      = require('../middleware');

//==============
//Comments Routes
//==============

const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//Comment new
router.get("/new", middleware.isLoggedIn, asyncMiddleware(async (req, res,next) => {
    //find the campground with provided ID
    const campground = await Campground.findById(req.params.id);
    res.render('comments/new', { campground: campground });
}));

//Comments create
router.post("/",  middleware.isLoggedIn, async (req, res) => {
    //lookup campground using ID
     try {
        const campground = await Campground.findById(req.params.id);
        const comment = await  Comment.create(req.body.comment);
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        //save comment
        comment.save();
        campground.comments.push(comment);
        campground.save();
        req.flash('success', 'Successfully added comment.');
        //redirect to show page
        res.redirect("/campgrounds/" + campground._id);
    } catch(err) {
        console.log(err);
        res.redirect("/campgrounds");
    }
});

//COMMENTS Edit Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, async(req, res) => {
    try {
         const foundComment = await Comment.findById(req.params.comment_id);
         res.render('comments/edit', {campground_id:req.params.id, comment:foundComment});
     } catch(err) {
        res.redirect('back');
     }
});

//COMMENTS Update Route
router.put('/:comment_id', async(req, res) => {
    try {
        const result = await  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        res.redirect('/campgrounds/' + req.params.id);
    } catch(err) {
        res.redirect('back');
    }
});


//COMMENTS Destroy Route
router.delete('/:comment_id', middleware.checkCommentOwnership, async(req, res) => {
    try {
        const result = await  Comment.findByIdAndDelete(req.params.comment_id);
        req.flash('success', 'Successfully deleted comment.');
        res.redirect('/campgrounds/' + req.params.id);
    } catch(err) {
        res.redirect('back');
    }
});

module.exports = router;