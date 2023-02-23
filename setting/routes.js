'use strict'

module.exports = (app) => {
    const passport = require('passport')
    // const index = require('../controllers/index')
    const users = require('../controllers/users')

    // app
    // .route('/')
    // .get(index.index)


    app
        .route('/api/auth/signup')
        .post(users.signup)

    app
        .route('/api/auth/signin')
        .get(users.signin)

    app
        .route('/api/users')
        .get(passport.authenticate('jwt', { session: false }), users.getAllUsers)

}