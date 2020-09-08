const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const AUTH_KEY = process.env.AUTH_KEY;
const User = require('../models/user');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const email = req.body.email;
    const password = req.body.password;

    // create user
    bcrypt.hash(password, 12)
        .then( (hashedPassword) => {
            return User.create({
                email: email,
                password: hashedPassword
            });
        })
        .then( (user) => {
            return user.save();
        })
        .then( (user) => {
            res.send({
                userId: user.id
            });
        })
        .catch( (err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        });
};

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const email = req.body.email;
    const password = req.body.password;

    let loggedUser;
    return User.findOne({
        'where': {
            'email': email
        }
    })
        .then((user) => {
            if (!user) {
                const error = new Error('User and password do not match.');
                error.statusCode = 401;
                throw error;
            }
            loggedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then((validPassword) => {
            if(!validPassword) {
                const error = new Error('User and password do not match.');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    id: loggedUser.id,
                    email: loggedUser.email
                },
                AUTH_KEY,
                {
                    expiresIn: '7d'
                    // TODO: handle token expiration in front-end
                }
            );
            userData = {
                token: `Bearer ${token}`,
                id: loggedUser.id,
                email: loggedUser.email
            };
            res.send(userData);
            return userData;
        })
        .catch((err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
            return err;
        })
}
