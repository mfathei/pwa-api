'use strict';
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var formidable = require('formidable');
var fs = require('fs');

var Genre = require('./models/genre');
var Book = require('./models/book');
var Post = require('./models/post');

// to parse body for POST requests
app.use(bodyParser.json());
// Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Connect to Mongoose
mongoose.connect("mongodb://localhost/bookstore");
var db = mongoose.connection;

app.get('/', function (req, res) {
    res.send("Please use /api/posts");
});


// ============= posts =================

app.get('/api/posts', function (req, res) {
    Post.getPosts(function (err, posts) {
        if (err) {
            throw err;
        }
        res.status(200).json(posts);
    });
});

app.get('/api/posts/:_id', function (req, res) {
    Post.getPostById(req.params._id, function (err, post) {
        if (err) {
            throw err;
        }
        res.status(200).json(post);
    });
});

app.post('/api/posts', function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.file.path;
        var newpath = '/tmp/pwa-api/' + files.file.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            // res.write('File uploaded and moved!');
            // res.end();
        });

        var post = {
            id: fields.id,
            title: fields.title,
            location: fields.location,
            image: '/src/images/sf-boat.jpg'// encodeURIComponent(file.name)
        };
        console.log('post', post);
        Post.addPost(post, function (err, post) {
            if (err) {
                throw err;
            }
            res.status(201).json(post);
        });
    });

});

app.put('/api/posts/:_id', function (req, res) {
    var id = req.params._id;
    var post = req.body;
    Post.updatePost(id, post, {}, function (err, post) {
        if (err) {
            throw err;
        }
        res.status(202).json(post);
    });
});

app.delete('/api/posts/:_id', function (req, res) {
    var id = req.params._id;
    Post.removePost(id, function (err, post) {
        if (err) {
            throw err;
        }
        res.status(204).json(post);
    });
});

app.post('/api/storePostData', function (req, res) {

});

// ============= genres ================

app.get('/api/genres', function (req, res) {
    Genre.getGenres(function (err, genres) {
        if (err) {
            throw err;
        }
        res.json(genres);
    });
});

app.get('/api/genres/:_id', function (req, res) {
    Genre.getGenreById(req.params._id, function (err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.post('/api/genres', function (req, res) {
    var genre = req.body;
    Genre.addGenre(genre, function (err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.put('/api/genres/:_id', function (req, res) {
    var id = req.params._id;
    var genre = req.body;
    Genre.updateGenre(id, genre, {}, function (err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.delete('/api/genres/:_id', function (req, res) {
    var id = req.params._id;
    Genre.removeGenre(id, function (err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

// ============= books ================

app.get('/api/books', function (req, res) {
    Book.getBooks(function (err, books) {
        if (err) {
            throw err;
        }
        res.json(books);
    });
});

app.get('/api/books/:_id', function (req, res) {
    Book.getBookById(req.params._id, function (err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.post('/api/books', function (req, res) {
    var book = req.body;
    Book.addBook(book, function (err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.put('/api/books/:_id', function (req, res) {
    var id = req.params._id;
    var book = req.body;
    Book.updateBook(id, book, {}, function (err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.delete('/api/books/:_id', function (req, res) {
    var id = req.params._id;
    Book.removeBook(id, function (err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});
// ===================================

app.listen(3000);
console.log("Running on port 3000...");
