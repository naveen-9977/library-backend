const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const router = express.Router();

// --- Registration ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully. Waiting for admin approval.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- Login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// --- ADMIN: Get all unapproved users ---
router.get('/admin/pending', async (req, res) => {
    try {
        const users = await User.find({ isApproved: false, isAdmin: false });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- ADMIN: Approve a user ---
router.put('/admin/approve/:userId', async (req, res) => {
    try {
        const { joinDate, dueDate } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isApproved: true, joinDate: joinDate, dueDate: dueDate },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- NEW ROUTE ADDED ---
// --- ADMIN: Get all users (approved and pending) ---
router.get('/admin/users', async (req, res) => {
    try {
        // Find all users who are not admins
        const users = await User.find({ isAdmin: false });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;