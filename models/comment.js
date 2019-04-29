const mongoose = require('mongoose');
//SCHEMA SETUP
const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username:String
    }
});

module.exports = mongoose.model('Comment', commentSchema);
