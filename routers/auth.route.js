const route = require('express').Router()
const AuthController = require('../controllers/auth.controller')
const body = require('express').urlencoded({ extended: true })
const guardAuth = require('./guardAuth')

// Web routes
route.get('/register', guardAuth.notAuth, AuthController.getRegisterPage)
route.post('/register', body, AuthController.postRegisterData)
route.get('/login', guardAuth.notAuth, AuthController.getLoginPage)
route.post('/login', body, AuthController.postLoginData)
route.post('/logout', AuthController.logoutFunctionController)

// ✅ API routes for Cypress or frontend SPA
route.post('/api/register', body, AuthController.postRegisterDataApi)
route.post('/api/login', body, AuthController.postLoginDataApi)
route.post('/api/logout', AuthController.logoutApi)

module.exports = route
