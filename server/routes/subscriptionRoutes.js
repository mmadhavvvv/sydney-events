const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

router.post('/', async (req, res) => {
    try {
        const { email, eventId, consent } = req.body;
        if (!email || !eventId) return res.status(400).json({ message: 'Missing fields' });

        const sub = await Subscription.create({ email, eventId, consent });
        res.status(201).json(sub);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
