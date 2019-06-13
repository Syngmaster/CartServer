let jwt = require('jsonwebtoken');
let config = require('./config');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token === undefined)  {
        return res.status(401).send({
            message: 'No token provided'
        });
    }

    if (token.startsWith('Bearer ') == null) {
        return res.status(401).json({
            code: 401,
            message: "Token must start from 'Bearer '"
        });
    }

    // Remove Bearer from string
    token = token.slice(7, token.length);

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    code: 401,
                    message: 'Token is not valid'
                });
            } else {
                // saving the token so it could be used for other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            code: 401,
            message: 'Auth token is not supplied'
        });
    }

};

module.exports = {
    checkToken
};