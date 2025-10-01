const express = require('express');
const FeeRecord = require('../models/feeRecord.model');
const mongoose = require('mongoose');
const router = express.Router();

// ADMIN: Get a student's full payment history
router.get('/user/:userId', async (req, res) => {
    try {
        const records = await FeeRecord.find({ user: req.params.userId }).sort({ year: -1, month: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// STUDENT: Get a student's pending fees and total due
router.get('/student/:userId', async (req, res) => {
    try {
        const pendingFees = await FeeRecord.find({ user: req.params.userId, status: 'Pending' }).sort({ year: 1, month: 1 });
        const totalDue = pendingFees.reduce((acc, fee) => acc + fee.amount, 0);
        res.json({
            pendingFees,
            totalDue,
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ADMIN: Record a cash payment
router.put('/record-cash/:feeId', async (req, res) => {
    try {
        const record = await FeeRecord.findByIdAndUpdate(
            req.params.feeId,
            {
                status: 'Paid',
                paymentMethod: 'Cash',
                paymentDate: new Date(),
            },
            { new: true }
        );
        res.json(record);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ADMIN: Get a summary of all pending fees
router.get('/pending-summary', async (req, res) => {
    try {
        const pendingFees = await FeeRecord.find({ status: 'Pending' })
            .populate('user', 'name email studentId');
        res.json(pendingFees);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;