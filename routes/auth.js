const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const router = express.Router();
const authController = require('../controllers/auth');

router.post('/',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Invalid e-mail')
            .normalizeEmail(),
        body('password')
            .exists()
            .withMessage('Password must be set.')
    ],
    authController.login,
);

router.post('/signup',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Invalid e-mail')
            .normalizeEmail()
            .custom((value, {req}) => {
                return User.findOne({
                    'where': {
                        'email': value
                    }
                }).then((user) => {
                    if(user)
                        return Promise.reject('E-mail already registered.');
                });
            }),
        body('password')
            .isLength({min: 8})
            .withMessage('Password must be at least 8 characters long.')
            /*.trim() // avoid white-spaces only passwords
            .not()
            .isEmpty()
            .withMessage('Password must not be empty.')*/
    ],
    authController.signUp);

module.exports = router;
