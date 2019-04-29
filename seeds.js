const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Pinery",
        image: "http://www.ontarioparks.com/parksblog/wp-content/uploads/2014/03/Pinery_BeachSunset-825x510.jpg",
        description: "A breathtakingly beautiful park with 10 km of sand beach on the shores of mighty Lake Huron."
    },
    {
        name: "Aaron",
        image: "http://www.ontarioparks.com/parksblog/wp-content/uploads/2016/09/Aaron_68880020.jpg",
        description: "Conveniently located off of the Trans-Canada Highway, this park is the perfect stopping point for cross-country explorers."
    },
    {
        name: "Bon Echo",
        image: "http://daringwanderer.com/wp-content/uploads/blog/15-07-29/Adventurous-Bon-Echo-Engagement-01.jpg",
        description: "Camping experience for everyone: RV, car camping, backcountry, and roofed accommodations"
    },
    {
        name: "Chutes",
        image: "http://outaouais.quebecheritageweb.com/files/outaouaisheritagewebmagazine/attraction-images/IMG_7101.JPG",
        description: "One kilometer from the Trans-Canada Highway this is the only provincial park between Sudbury and Sault Ste Marie"
    },
    {
        name: "Bonnechere",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Bonnechere_campground.JPG",
        description: "McNaughton Trail with Foot Prints in Time enhanced interpretive experience"
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.deleteMany({}, function (err) {
        if (!err) {
            console.log("remove campgournds!");
            // Add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (!err) {
                        console.log("add a campground");
                        // create a comment
                        Comment.create(
                            {
                                text: "This place is great!",
                                author: "Homer"
                            }, function (err, comment) {
                                if (!err) {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Create a new comment!");
                                }
                            }); // create Comment
                    }
                }); // create Campground
            }); // data.forEach
        }// not err
    });//remove
}

module.exports = seedDB;
