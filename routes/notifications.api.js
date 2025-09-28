const express = require('express');
const Notification = require('../models/notification.model');
const router = express.Router();

// ALL USERS: Get all notifications, newest first
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ date: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;