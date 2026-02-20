const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    venue: String,
    city: { type: String, default: 'Sydney' },
    imageUrl: String,
    sourceUrl: { type: String, unique: true },
    source: String,
    category: String,
    status: {
        type: String,
        enum: ['new', 'imported', 'updated', 'inactive'],
        default: 'new'
    },
    lastScraped: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
