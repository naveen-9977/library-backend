const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new mongoose.Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
    penalty: { type: Number, default: 0 },
    // ADD THIS FIELD
    penaltyStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
});

module.exports = mongoose.model('Issue', IssueSchema);