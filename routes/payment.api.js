const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const FeeRecord = require('../models/feeRecord.model');
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// STUDENT: Create a Razorpay Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, feeId } = req.body;
        const options = {
            amount: amount * 100, // Amount in paisa
            currency: 'INR',
            receipt: `receipt_fee_${feeId}`,
        };
        const order = await razorpay.orders.create(options);
        
        // Save the order ID to the fee record
        await FeeRecord.findByIdAndUpdate(feeId, { razorpayOrderId: order.id });
        
        res.json(order);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// STUDENT: Verify payment after it's completed
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is authentic, update the fee record
            await FeeRecord.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: 'Paid',
                    paymentMethod: 'Online',
                    paymentDate: new Date(),
                }
            );
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, msg: 'Payment verification failed' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;