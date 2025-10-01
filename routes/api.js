const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const FeeRecord = require('../models/feeRecord.model'); // Added FeeRecord model

// --- NEW ROUTE for Admin Stats ---
router.get('/admin/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ isAdmin: false });
        const pendingStudents = await User.countDocuments({ isAdmin: false, isApproved: false });
        const approvedStudents = await User.countDocuments({ isAdmin: false, isApproved: true });

        res.json({
            total: totalStudents,
            pending: pendingStudents,
            approved: approvedStudents,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Registration ---
router.post('/register', async (req, res) => {
    const { name, email, password, studentId } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, password, studentId });
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

// --- ADMIN User Routes ---
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

        // Generate the first fee record for the new user
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const feeRecord = new FeeRecord({
            user: user._id,
            month: currentMonth,
            year: currentYear,
            amount: 500,
        });
        await feeRecord.save();
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;