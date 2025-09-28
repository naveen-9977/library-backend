const express = require('express');
const Issue = require('../models/issue.model');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const router = express.Router();

const PENALTY_PER_DAY = 5; // Example: 5 currency units per day

// ADMIN: Issue a new book
router.post('/issue', async (req, res) => {
    try {
        const { bookId, userId, dueDate } = req.body;
        // Find the user by their studentId
        const user = await User.findOne({ studentId: userId });
        if (!user) {
            return res.status(404).json({ msg: 'Student not found with that ID' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        if (book.quantity <= book.issuedQuantity) {
            return res.status(400).json({ msg: 'Book is not available' });
        }

        book.issuedQuantity += 1;
        await book.save();

        const newIssue = new Issue({
            book: bookId,
            user: user._id, // Use the user's ObjectId
            dueDate,
        });
        await newIssue.save();

        res.status(201).json(newIssue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ADMIN: Return a book
router.put('/return/:issueId', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.issueId);
        if (!issue) {
            return res.status(404).json({ msg: 'Issue record not found' });
        }
        if (issue.status === 'Returned') {
             return res.status(400).json({ msg: 'Book already returned' });
        }

        const book = await Book.findById(issue.book);
        if (book) {
            book.issuedQuantity -= 1;
            await book.save();
        }

        issue.returnDate = new Date();
        issue.status = 'Returned';

        // Calculate penalty if overdue
        const dueDate = new Date(issue.dueDate);
        if (issue.returnDate > dueDate) {
            const diffTime = Math.abs(issue.returnDate - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            issue.penalty = diffDays * PENALTY_PER_DAY;
        }

        await issue.save();
        res.json(issue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ADMIN: Get all currently issued (not returned) books
router.get('/issued', async (req, res) => {
    try {
        const issues = await Issue.find({ status: 'Issued' })
            .populate('book')
            .populate('user')
            .sort({ dueDate: 1 });
        res.json(issues);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// STUDENT: Get all books issued to a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const issues = await Issue.find({ user: req.params.userId, status: 'Issued' })
            .populate('book')
            .sort({ dueDate: 1 });
        res.json(issues);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;