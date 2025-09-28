const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 1 },
    issuedQuantity: { type: Number, default: 0 },
    addedOn: { type: Date, default: Date.now },
});

BookSchema.virtual('isAvailable').get(function() {
    return this.quantity > this.issuedQuantity;
});

module.exports = mongoose.model('Book', BookSchema);