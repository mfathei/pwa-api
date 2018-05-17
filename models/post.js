var mongoose = require('mongoose');

// Genre Schema 
// _id is auto added in MongoDB but id is needed for client side indexedDB storage
var postSchema = mongoose.Schema({
    id: {
        type: String,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '/src/images/sf-boat.jpg'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

var Post = module.exports = mongoose.model('Post', postSchema);

// GET Posts
module.exports.getPosts = function (callback, limit) {
    Post.find(callback).limit(limit);
}

// GET Post
module.exports.getPostById = function (id, callback) {
    Post.findById(id, callback);
}

// Add Post
module.exports.addPost = function (post, callback) {
    Post.create(post, callback);
    return Promise.resolve(post);
}

// Update Post
module.exports.updatePost = function (id, post, options, callback) {
    var query = { _id: id };
    var update = {
        name: post.name
    }
    Post.findOneAndUpdate(query, update, options, callback);
}

// Delete Post
module.exports.removePost = function (id, callback) {
    var query = { _id: id };
    Post.remove(query, callback);
}
