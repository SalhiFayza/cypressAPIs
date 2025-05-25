const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

var schemaAuth = mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

var User = mongoose.model('user', schemaAuth)
var url = "mongodb://localhost:27017/databook"

exports.registerFunctionModel = (name, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.findOne({ email: email }))
            .then((user) => {
                if (user) {
                    mongoose.disconnect()
                    reject('Email is already used')
                } else {
                    return bcrypt.hash(password, 10)
                }
            })
            .then((hPassword) => {
                let user = new User({ name, email, password: hPassword })
                return user.save()
            })
            .then(() => {
                mongoose.disconnect()
                resolve('registered!')
            })
            .catch((err) => {
                mongoose.disconnect()
                reject(err)
            })
    })
}

exports.loginFunctionModel = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.findOne({ email }))
            .then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password)
                        .then((isMatch) => {
                            if (isMatch) {
                                mongoose.disconnect()
                                resolve(user._id)
                            } else {
                                mongoose.disconnect()
                                reject('Invalid password')
                            }
                        })
                } else {
                    mongoose.disconnect()
                    reject("User not found")
                }
            })
            .catch((err) => {
                mongoose.disconnect()
                reject(err)
            })
    })
}
