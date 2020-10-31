const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const user_Collection = require('../Models/user_model');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) return res.json({TokenError: 'you must login!'});

    const token = authorization.replace('Bearer', '');
    JWT.verify(token, JWT_SECRET, (err, payload) => {
        if(err) return res.json({TokenError: 'you must login!'});

        const { _id } = payload;
        user_Collection.findById(_id)
        .then(me => {
            req.user = me;
            next()
        })

    })
}