const authModel = require('../models/auth.model')

// PAGE WEB
exports.getRegisterPage = (req, res) => {
    res.render('register', {
        verifUser: req.session.userId,
        message: req.flash('error')[0]
    })
}

exports.postRegisterData = (req, res) => {
    const { name, email, password } = req.body

    // Validation des champs
    if (!name || !email || !password) {
        req.flash('error', 'All fields are required')
        return res.redirect('/register')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.flash('error', 'Invalid email format')
        return res.redirect('/register')
    }

    if (password.length < 8) {
        req.flash('error', 'Password must be at least 8 characters')
        return res.redirect('/register')
    }

    authModel.registerFunctionModel(name, email, password)
        .then(() => res.redirect('/login'))
        .catch((err) => {
            req.flash('error', err)
            res.redirect('/register')
        })
}

exports.getLoginPage = (req, res) => {
    res.render('login', {
        verifUser: req.session.userId,
        message: req.flash('error')[0]
    })
}

exports.postLoginData = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        req.flash('error', 'Email and password are required')
        return res.redirect('/login')
    }

    authModel.loginFunctionModel(email, password)
        .then((id) => {
            req.session.userId = id
            res.redirect('/')
        })
        .catch((err) => {
            req.flash('error', err)
            res.redirect('/login')
        })
}

exports.logoutFunctionController = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

// ✅ API ROUTES (pour Cypress / SPA)
exports.postRegisterDataApi = (req, res) => {
    const { name, email, password } = req.body

    // Validation API
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    authModel.registerFunctionModel(name, email, password)
        .then(() => res.status(200).json({ message: 'Registered successfully' }))
        .catch((err) => res.status(400).json({ error: err }))
}

exports.postLoginDataApi = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
    }

    authModel.loginFunctionModel(email, password)
        .then((id) => {
            req.session.userId = id
            res.status(200).json({ message: 'Logged in successfully', userId: id })
        })
        .catch((err) => res.status(401).json({ error: err }))
}

exports.logoutApi = (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: 'Logged out' })
    })
}
