const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeeRecordSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ['Cash', 'Online'] },
    razorpayOrderId: { type: String },
});

// Ensure a user has only one record per month/year
FeeRecordSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('FeeRecord', FeeRecordSchema);