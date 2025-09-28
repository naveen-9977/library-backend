const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const router = express.Router();

// --- Registration (Updated) ---
router.post('/register', async (req, res) => {
    // Added studentId here
    const { name, email, password, studentId } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Added studentId to the new user object
        user = new User({ name, email, password, studentId });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully. Waiting for admin approval.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- Login (No changes) ---
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


// --- ADMIN Routes (No changes) ---
router.get('/admin/pending', async (req, res) => {
    try {
        const users = await User.find({ isApproved: false, isAdmin: false });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

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

module.exports = router;