'use strict';
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var formidable = require('formidable');
var fs = require('fs');
var fsextra = require('fs-extra');
var webpush = require('web-push');

var Genre = require('./models/genre');
var Book = require('./models/book');
var Post = require('./models/post');
var Subscription = require('./models/subscription');

// to parse body for POST requests
app.use(bodyParser.json());
// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var imageRealtivePath = '/media/f/PROGRAMMING/Progressive web apps/WORK/pwa-guide/public/upload/photos/';
var imagePath = '/upload/photos/';

// Connect to Mongoose
mongoose.connect("mongodb://localhost/bookstore");
var db = mongoose.connection;

app.get('/', function(req, res) {
    res.send("Please use /api/posts");
});


// ============= posts =================

app.get('/api/posts', function(req, res) {
    Post.getPosts(function(err, posts) {
        if (err) {
            throw err;
        }
        res.status(200).json(posts);
    });
});

app.get('/api/posts/:_id', function(req, res) {
    Post.getPostById(req.params._id, function(err, post) {
        if (err) {
            throw err;
        }
        res.status(200).json(post);
    });
});

app.post('/api/posts', function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.file.path;
        // var newpath = '/data/pwa-api/' + files.file.name;
        var newpath = imageRealtivePath + files.file.name;
        fsextra.move(oldpath, newpath)
            .catch(function(err) {
                console.log(err);
            });

        var post = {
            id: fields.id,
            title: fields.title,
            location: fields.location,
            rawLocation: {
                lat: fields.rawLocationLat,
                lng: fields.rawLocationLng
            },
            image: imagePath + files.file.name // encodeURIComponent(file.name)
        };
        // console.log('post', post);
        Post.addPost(post, function(err, post) {
                if (err) {
                    throw err;
                }


            }).then(function() {
                webpush.setVapidDetails('mailto:oracle.dev10g@gmail.com', 'BLet4p6u28mtoXKDmbGx1eHtXxHb8zRRSruyP-I7Hl9z7a6mYZd33_ogVCkMIZ2fTT806Lb4XtkoE7ALHPBGoSM', '7LyjUQ65yhm4UD6cE46OHnlD04waK676mlgEqomf_vI');
                return Subscription.getSubscriptions(function(err, subscriptions) {
                    if (err) {
                        throw err;
                    }
                });

            })
            .then(function(subscriptions) {
                // console.log('subscriptions:', subscriptions);
                subscriptions.forEach(function(sub) {
                    var pushConfig = {
                        endpoint: sub.endpoint,
                        keys: {
                            auth: sub.keys.auth,
                            p256dh: sub.keys.p256dh
                        }
                    };

                    webpush.sendNotification(pushConfig,
                            JSON.stringify({ title: 'New Post', content: 'New Post added!', openUrl: '/help' })
                        )
                        .catch(function(err) {
                            console.log(err);
                        })
                });
                res.status(201).json({ message: 'Data stored', id: fields.id });
            })
            .catch(function(err) {
                res.status(500).json({ error: err });
            });
    });

});

app.put('/api/posts/:_id', function(req, res) {
    var id = req.params._id;
    var post = req.body;
    Post.updatePost(id, post, {}, function(err, post) {
        if (err) {
            throw err;
        }
        res.status(202).json(post);
    });
});

app.delete('/api/posts/:_id', function(req, res) {
    var id = req.params._id;
    Post.removePost(id, function(err, post) {
        if (err) {
            throw err;
        }
        res.status(204).json(post);
    });
});


// ============= subscriptions ================

app.get('/api/subscriptions', function(req, res) {
    Subscription.getSubscriptions(function(err, subscriptions) {
        if (err) {
            throw err;
        }
        res.json(subscriptions);
    });
});

app.get('/api/subscriptions/:_id', function(req, res) {
    Subscription.getSubscriptionById(req.params._id, function(err, subscription) {
        if (err) {
            throw err;
        }
        res.json(subscription);
    });
});

app.post('/api/subscriptions', function(req, res) {
    /** if u want to register a device clear site cache in Application tab 
     * then refresh then click Enable Notification button
     */
    // console.log('130', req.body);
    var subscription2 = req.body;
    Subscription.addSubscription(subscription2, function(err, subscription) {
        if (err) {
            throw err;
        }
        res.status(201).json(subscription2);
    });

});

app.put('/api/subscriptions/:_id', function(req, res) {
    var id = req.params._id;
    var subscription = req.body;
    Subscription.updateSubscription(id, subscription, {}, function(err, subscription) {
        if (err) {
            throw err;
        }
        res.json(subscription);
    });
});

app.delete('/api/subscriptions/:_id', function(req, res) {
    var id = req.params._id;
    Subscription.removeSubscription(id, function(err, subscription) {
        if (err) {
            throw err;
        }
        res.json(subscription);
    });
});

// ============= genres ================

app.get('/api/genres', function(req, res) {
    Genre.getGenres(function(err, genres) {
        if (err) {
            throw err;
        }
        res.json(genres);
    });
});

app.get('/api/genres/:_id', function(req, res) {
    Genre.getGenreById(req.params._id, function(err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.post('/api/genres', function(req, res) {
    var genre = req.body;
    Genre.addGenre(genre, function(err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.put('/api/genres/:_id', function(req, res) {
    var id = req.params._id;
    var genre = req.body;
    Genre.updateGenre(id, genre, {}, function(err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.delete('/api/genres/:_id', function(req, res) {
    var id = req.params._id;
    Genre.removeGenre(id, function(err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

// ============= books ================

app.get('/api/books', function(req, res) {
    Book.getBooks(function(err, books) {
        if (err) {
            throw err;
        }
        res.json(books);
    });
});

app.get('/api/books/:_id', function(req, res) {
    Book.getBookById(req.params._id, function(err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.post('/api/books', function(req, res) {
    var book = req.body;
    Book.addBook(book, function(err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.put('/api/books/:_id', function(req, res) {
    var id = req.params._id;
    var book = req.body;
    Book.updateBook(id, book, {}, function(err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.delete('/api/books/:_id', function(req, res) {
    var id = req.params._id;
    Book.removeBook(id, function(err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});
// ===================================

app.listen(3000);
console.log("Running on port 3000...");