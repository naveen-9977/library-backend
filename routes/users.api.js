const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const router = express.Router();

// STUDENT: Change Password
router.put('/change-password', async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect old password' });
        }

        // Hash the new password and save it
        user.password = newPassword; // The pre-save hook in user.model.js will hash it
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;