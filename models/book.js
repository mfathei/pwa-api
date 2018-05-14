var mongoose = require('mongoose');

// Book Schema
var bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    author: {
        type: String,
        required: true
    },
    pages: {
        type: String
    }
});

var Book = module.exports = mongoose.model('Book', bookSchema);

// GET Books
module.exports.getBooks = function(callback, limit){
    Book.find(callback).limit(limit);
}

// GET Book
module.exports.getBookById = function(id, callback){
    Book.findById(id, callback);
}