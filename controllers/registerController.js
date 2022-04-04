const generateAccessToken = require('../helpers/signToken')
const bcrypt = require('bcrypt')
const encrypt = 10

const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = function(req, res, cb) {
    (async() => {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        //datas
        var email = req.body.email
        var password = req.body.password

        //verify all datas are there
        if (email === '' || password === '') {
            res.statusCode = 500
            cb('Please send all informations.')
        } else {
            //verify password have minimal length 5
            if (password.length < 5) {
                res.statusCode = 500
                cb('Minimal password length is 5.')
            } else {
                //verify email match to email format
                if (!email.match(mailformat)) {
                    res.statusCode = 500
                    cb('Email not correspond to good format.')
                } else {
                    User.findOne({ email: email }).then(function(data) {
                        //verify email not already asign to another account
                        if (data) {
                            res.statusCode = 500
                            cb('Email already asign to another account.')
                        } else {
                            bcrypt.hash(password, encrypt, function(err, hash) {
                                if (err) console.log(err)

                                var newUser = new User({
                                    email: email,
                                    password: hash
                                })

                                newUser.save().then(function() {
                                    res.statusCode = 200
                                    cb(`Token : ${generateAccessToken(email)}`)
                                })
                            })
                        }
                    })

                }
            }
        }
    })()

}