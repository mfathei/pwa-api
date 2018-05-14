'use strict';
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Genre = require('./models/genre');

// Connect to Mongoose
mongoose.connect("mongodb://localhost/bookstore");
var db = mongoose.connection;

app.get('/', function (req , res){
    res.send("Please use /api/posts");
});

// ============= genres ================

app.get('/api/genres', function(req, res){
    Genre.getGenres(function(err, genres){
        if(err){
            throw err;
        }
        res.json(genres);
    });
});


app.listen(3000);
console.log("Running on port 3000...");
