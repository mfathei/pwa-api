var mongoose = require('mongoose');

// Book Schema
var bookSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    create_data: {
        type: Date,
        default: Date.now
    }
});

var Book = module.exports = mongoose.model('Book', bookSchema);

// GET Books
module.exports.getBooks = function(callback, limit){
    Book.find(callback).limit(limit);
}