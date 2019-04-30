const Campground = require("../models/campground");
const Comment = require("../models/comment");
// all middleware goes here
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = async (req, res, next) => {
  //is user logged in
  if (req.isAuthenticated()) {
    try {
      const foundCampground = await Campground.findById(req.params.id);
      if (foundCampground.author.id.equals(req.user._id)) {
        next(); //move on to next function; i.e. edit, delete, etc.
      } else {
        req.flash("error", "You do not have permission to do that.");
        //if not, redirect
        res.redirect("back");
      }
    } catch (err) {
      req.flash("error", "Campground not found.");
      res.redirect("back");
    }
  } else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = async (req, res, next) => {
  //is user logged in
  if (req.isAuthenticated()) {
    try {
      const foundComment = await Comment.findById(req.params.comment_id);
      if (foundComment.author.id.equals(req.user._id)) {
        next(); //move on to next function; i.e. edit, delete, etc.
      } else {
        //if not, redirect
        res.redirect("back");
      }
    } catch (err) {
      req.flash("error", "You do not have permission to do that.");
      //if not, redirect
      res.redirect("back");
    }
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged to do that.");
  res.redirect("/login");
};

module.exports = middlewareObj;
