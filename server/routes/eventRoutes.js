const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Subscription = require('../models/Subscription');

// GET all events
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, city, status, search, startDate, endDate } = req.query;

        let query = {};
        if (city) query.city = new RegExp(city, 'i');
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { venue: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const events = await Event.find(query)
            .sort({ date: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Event.countDocuments(query);

        res.json({
            events,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Subscribe & Redirect
router.post('/:id/subscribe', async (req, res) => {
    try {
        const { email, consent } = req.body;
        if (!email) return res.status(400).json({ message: 'Email required' });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Save subscription
        await Subscription.create({
            email,
            eventId: req.params.id,
            consent: !!consent,
            eventTitle: event.title,
            subscribedAt: new Date()
        });

        // Return redirect URL
        res.json({ redirectUrl: event.sourceUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// UPDATE status (Admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
