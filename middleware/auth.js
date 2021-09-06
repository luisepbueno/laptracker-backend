const jwt = require('jsonwebtoken');

const AUTH_KEY = process.env.AUTH_KEY;

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('User not logged.');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, AUTH_KEY);
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            err.statusCode = 401;
        else
            err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.id;

    next();
}
