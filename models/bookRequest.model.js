const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookRequestSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookTitle: { type: String, required: true },
    author: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected', 'Ordered'], 
        default: 'Pending' 
    },
    adminReply: { type: String },
});

module.exports = mongoose.model('BookRequest', BookRequestSchema);