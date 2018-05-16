var mongoose = require('mongoose');

// Subscription Schema 
// _id is auto added in MongoDB
var subscriptionSchema = mongoose.Schema({
    endpoint: {
        type: String,
        required: true
    },
    keys: {
        auth: {
            type: String,
            required: true
        },
        p256dh: {
            type: String,
            required: true
        }
    }
});

var Subscription = module.exports = mongoose.model('Subscription', subscriptionSchema);

// GET Subscriptions
module.exports.getSubscriptions = function (callback, limit) {
    Subscription.find(callback).limit(limit);
}

// GET Subscription
module.exports.getSubscriptionById = function (id, callback) {
    Subscription.findById(id, callback);
}

// Add Subscription
module.exports.addSubscription = function (subscription, callback) {
    Subscription.create(subscription, callback);
}

// Update Subscription
module.exports.updateSubscription = function (id, subscription, options, callback) {
    var query = { _id: id };
    var update = {
        name: subscription.name
    }
    Subscription.findOneAndUpdate(query, update, options, callback);
}

// Delete Subscription
module.exports.removeSubscription = function (id, callback) {
    var query = { _id: id };
    Subscription.remove(query, callback);
}
