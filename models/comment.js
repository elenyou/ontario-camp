const mongoose = require('mongoose');
//SCHEMA SETUP
const commentSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model('Comment', commentSchema);
