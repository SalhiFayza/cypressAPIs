const bookModel = require('../models/book.model')
const mongoose = require('mongoose')

// Utilitaire pour valider ObjectId MongoDB
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}

exports.getAllBooksController = (req, res, next) => {
    bookModel.getAllBooks()
        .then(books => {
            res.render('books', { books, verifUser: req.session.userId })
        })
        .catch(err => {
            console.error(err)
            res.status(500).render('error', { message: 'Server error', error: err })
        })
}

exports.getOneBookDetailsController = (req, res, next) => {
    let id = req.params.id

    if (!isValidObjectId(id)) {
        return res.status(404).render('404', { message: 'Invalid book ID', verifUser: req.session.userId })
    }

    bookModel.getOneBookDetails(id)
        .then(book => {
            if (!book) {
                return res.status(404).render('404', { message: 'Book not found', verifUser: req.session.userId })
            }
            res.render('details', { book, verifUser: req.session.userId })
        })
        .catch(err => {
            console.error(err)
            res.status(500).render('error', { message: 'Server error', error: err })
        })
}

exports.getAddBookController = (req, res, next) => {
    res.render('addbook', {
        verifUser: req.session.userId,
        Smessage: req.flash('Successmessage')[0],
        Emessage: req.flash('Errormessage')[0]
    })
}

exports.postAddBookController = (req, res, next) => {
    const { title, description, author, price } = req.body
    const image = req.file ? req.file.filename : null

    // Validation basique des champs
    if (!title || !description || !author || !price || !image) {
        req.flash('Errormessage', 'Please fill in all fields and upload an image.')
        return res.redirect('/addbook')
    }

    bookModel.postDataBookModel(title, description, author, price, image, req.session.userId)
        .then(msg => {
            req.flash('Successmessage', msg)
            res.redirect('/addbook')
        })
        .catch(err => {
            req.flash('Errormessage', err)
            res.redirect('/addbook')
        })
}

exports.getMybooksPage = (req, res, next) => {
    bookModel.getmyBooks(req.session.userId)
        .then(books => {
            res.render('mybooks', {
                verifUser: req.session.userId,
                mybooks: books
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).render('error', { message: 'Server error', error: err })
        })
}

exports.deleteBookController = (req, res, next) => {
    let id = req.params.id

    if (!isValidObjectId(id)) {
        return res.status(404).render('404', { message: 'Invalid book ID', verifUser: req.session.userId })
    }

    bookModel.deletebook(id)
        .then(() => {
            res.redirect('/mybooks')
        })
        .catch(err => {
            console.error(err)
            res.status(500).render('error', { message: 'Server error', error: err })
        })
}

exports.getMybookUpdatePage = (req, res, next) => {
    let id = req.params.id

    if (!isValidObjectId(id)) {
        return res.status(404).render('404', { message: 'Invalid book ID', verifUser: req.session.userId })
    }

    bookModel.getPageUpdateBookModel(id)
        .then(book => {
            if (!book) {
                return res.status(404).render('404', { message: 'Book not found', verifUser: req.session.userId })
            }
            res.render('updateBook', {
                bookUpdate: book,
                verifUser: req.session.userId,
                Smessage: req.flash('Successmessage')[0],
                Emessage: req.flash('Errormessage')[0]
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).render('error', { message: 'Server error', error: err })
        })
}

exports.postUpdateBookContoller = (req, res, next) => {
    const { bookId, title, description, author, price, oldImage } = req.body
    const image = req.file ? req.file.filename : oldImage

    // Validation basique
    if (!title || !description || !author || !price || !image) {
        req.flash('Errormessage', 'Please fill in all fields and upload an image if changing it.')
        return res.redirect(`/mybooks/update/${bookId}`)
    }

    bookModel.postUpdateBookModel(bookId, title, description, author, price, image, req.session.userId)
        .then(msg => {
            req.flash('Successmessage', msg)
            res.redirect(`/mybooks/update/${bookId}`)
        })
        .catch(err => {
            req.flash('Errormessage', err)
            res.redirect(`/mybooks/update/${bookId}`)
        })
}
