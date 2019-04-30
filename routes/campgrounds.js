const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//Display a list of all campgrounds (Index Route)
router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    //get all campgrounds from DB
    const allcampgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: allcampgrounds });
  })
);

//Add new camp to DB (Create Route)
router.post(
  "/",
  middleware.isLoggedIn,
  asyncMiddleware(async (req, res) => {
    //Get data from form and add to campgrounds array
    let { name, image, description, price } = req.body;
    let author = {
      id: req.user._id,
      username: req.user.username
    };
    await Campground.create({ name, image, description, author, price });
    res.redirect("/campgrounds");
  })
);

//Displays form to make a new camp (New Route)
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// Shows info about one camp (Show Route)
router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    //find the campground with provided ID
    await Campground.findById(req.params.id)
      .populate("comments")
      .exec((err, foundCampground) => {
        if (err) {
          console.log(err);
        }
        res.render("campgrounds/show", { campground: foundCampground });
      });
  })
);

//EDIT campground route
router.get(
  "/:id/edit",
  middleware.checkCampgroundOwnership,
  async (req, res) => {
    try {
      const foundCampground = await Campground.findById(req.params.id);
      res.render("campgrounds/edit", { campground: foundCampground });
    } catch (err) {
      res.redirect("campgrounds");
    }
  }
);

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  //find + update the correct camp
  try {
    let updatedCampground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    res.redirect("/campgrounds/" + req.params.id);
  } catch (err) {
    res.redirect("/campgrounds");
  }
});

//Remove campground route
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  try {
    let result = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  } catch (err) {
    res.redirect("/campgrounds");
  }
});

module.exports = router;
