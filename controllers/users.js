'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const response = require('./../response')
const db = require('./../setting/db')
const config = require('./../config')

exports.getAllUsers = (req, res) => {

    db.query('SELECT * FROM `user` ', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })

}

exports.signup = (req, res) => {

    db.query("SELECT  `id`, `login`, `email`, `realname`, `birthdate`, `country`, `conditions` FROM `user` WHERE `email` = '" + req.body.email + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else if(typeof rows !== 'undefined' && rows.length > 0) {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                response.status(302, {message: `There is already a user with this email ${rw.email}`}, res)
                return true
            })
        } else {
            const login = req.body.login
            const email = req.body.email
            const realname = req.body.realname
            const birthdate = req.body.birthdate
            const country = req.body.country
            const conditions = req.body.conditions

            const salt = bcrypt.genSaltSync(15)
            const password = bcrypt.hashSync(req.body.password, salt)

            const sql = "INSERT INTO `user`(`login`, `email`, `realname`, `birthdate`, `country`, `conditions`, `password`) VALUES('" + login + "', '" + email + "', '" + realname + "', '" + birthdate + "', '" + country + "', '" + conditions + "', '" + password + "')";
            db.query(sql, (error, results) => {
                if(error) {
                    response.status(400, error, res)
                } else {
                    response.status(200, {message: `Registration completed successfully`, results}, res)
                }
            })

        }
    })

}


exports.signin = (req, res) => {

    db.query("SELECT `id`, `email`, `password` FROM `user` WHERE `email` = '" + req.body.email + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else if(rows.length <= 0) {
            response.status(401, {message: `Email user - ${req.body.email} - not found. Please register!`}, res)
        } else {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                const password = bcrypt.compareSync(req.body.password, rw.password)
                if(password) {
                    //Если true мы пускаем юзера и генерируем токен
                    const token = jwt.sign({
                        userId: rw.id,
                        email: rw.email
                    }, config.jwt, { expiresIn: 120 * 120 })

                    response.status(200, {token: `Bearer ${token}`}, res)

                } else {
                    //Выкидываем ошибку что пароль не верный
                    response.status(401, {message: `Wrong password.`}, res)

                }
                return true
            })
        }
    })

}