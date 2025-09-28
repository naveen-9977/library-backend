const express = require('express');
// Corrected to lowercase 'b' to match the filename
const BookRequest = require('../models/bookRequest.model'); 
const Announcement = require('../models/announcement.model');
const router = express.Router();

// ... (rest of the file is the same and correct)
// --- BOOK REQUEST ROUTES ---

// STUDENT: Create a book request
router.post('/request', async (req, res) => {
    try {
        const { userId, bookTitle, author } = req.body;
        const newRequest = new BookRequest({ user: userId, bookTitle, author });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// STUDENT: Get their own book requests
router.get('/requests/user/:userId', async (req, res) => {
    try {
        const requests = await BookRequest.find({ user: req.params.userId }).sort({ requestDate: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ADMIN: Get all book requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await BookRequest.find().populate('user', 'name email').sort({ requestDate: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ADMIN: Update a book request
router.put('/request/:id', async (req, res) => {
    try {
        const { status, adminReply } = req.body;
        const updatedRequest = await BookRequest.findByIdAndUpdate(
            req.params.id,
            { status, adminReply },
            { new: true }
        );
        res.json(updatedRequest);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- ANNOUNCEMENT ROUTES ---

// ADMIN: Post an announcement
router.post('/announcement', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newAnnouncement = new Announcement({ title, content });
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ALL USERS: Get all announcements
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;