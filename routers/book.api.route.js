const express = require('express');
const router = express.Router();
const bookModel = require('../models/book.model');
const multer = require('multer');
const mongoose = require('mongoose');

// Multer config for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'assets/upload'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Utility: Check if ObjectId is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all books
router.get('/books', (req, res) => {
    bookModel.getAllBooks()
        .then(books => res.status(200).json({ books }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// POST add a book (with image)
router.post('/books/add', upload.single('image'), (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Missing request body.' });
    }

    const { title, description, author, price, userId } = req.body;
    const image = req.file ? req.file.filename : '';

    if (!title || !description || !author || !price || !userId || !image) {
        return res.status(400).json({
            message: 'All fields are required (title, description, author, price, userId, image).'
        });
    }

    if (isNaN(price)) {
        return res.status(400).json({ message: 'Price must be a numeric value.' });
    }

    const parsedPrice = parseFloat(price);

    bookModel.postDataBookModel(title, description, author, parsedPrice, image, userId)
        .then(() => res.status(200).json({
            message: 'Book added successfully',
            book: { title, description, author, price: parsedPrice, image, userId }
        }))
        .catch(err => {
            console.error('Error adding book:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        });
});

// POST add book via JSON only
router.post('/books/addjson', (req, res) => {
    const { title, description, author, price, userId, image } = req.body;

    if (!title || !description || !author || !price || !userId || !image) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (isNaN(price)) {
        return res.status(400).json({ message: 'Price must be a number.' });
    }

    const parsedPrice = parseFloat(price);

    bookModel.postDataBookModel(title, description, author, parsedPrice, image, userId)
        .then(() => res.status(200).json({ message: 'Book added successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// GET one book by ID
router.get('/books/:id', (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid book ID.' });
    }

    bookModel.getOneBookDetails(id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Book not found.' });
            }
            res.status(200).json({ book });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// DELETE book by ID
router.delete('/books/delete/:id', (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid book ID.' });
    }

    bookModel.deletebook(id)
        .then(() => res.status(200).json({ message: 'Deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
});
 
// PUT update a book
router.put('/books/update/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid book ID.' });
    }

    const { title, description, author, price, userId, oldImage } = req.body;
    const image = req.file ? req.file.filename : oldImage;

    // Basic validation
    if (!title || !description || !author || !price || !userId || !image) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (isNaN(price)) {
        return res.status(400).json({ message: 'Price must be a number.' });
    }

    const parsedPrice = parseFloat(price);

    bookModel.postUpdateBookModel(id, title, description, author, parsedPrice, image, userId)
        .then(msg => {
            res.status(200).json({ message: 'Book updated successfully', book: { id, title, description, author, price: parsedPrice, image, userId } });
        })
        .catch(err => {
            console.error('Update error:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        });
});


module.exports = router;
