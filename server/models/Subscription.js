const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    email: { type: String, required: true },
    eventId: { type: String, required: true },
    eventTitle: String,
    consent: { type: Boolean, default: false },
    subscribedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
