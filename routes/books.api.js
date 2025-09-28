const express = require('express');
const Book = require('../models/book.model');
const Notification = require('../models/notification.model'); // Import Notification model
const router = express.Router();

// ADMIN: Add a new book
router.post('/', async (req, res) => {
    try {
        const { title, author, subject, quantity } = req.body;
        const newBook = new Book({ title, author, subject, quantity });
        await newBook.save();

        // Create a notification when a new book is added
        const notification = new Notification({
            title: 'New Book Added',
            message: `The book "${title}" by ${author} is now available in the library.`,
            type: 'NewBook',
        });
        await notification.save();

        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ALL USERS: Get all books (with search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                ],
            };
        }
        const books = await Book.find(query);
        res.json(books);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ADMIN: Update a book
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ADMIN: Delete a book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        res.json({ msg: 'Book removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;