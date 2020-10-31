const express = require('express');
const router = express.Router();
const user_Collection = require('../Models/user_model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');

// Register
router.post('/register', (req, res) => {
    const { username, password, re_password } = req.body;

    if(!username || !password || !re_password) return res.json({error: 'Give all the fields'})

    if(password !== re_password) return res.json({error: "re_password doesn't match"})

    user_Collection.findOne({ username: username })
    .then(userFound => {
        if(userFound) return res.json({error: "this user already exist"})

        bcrypt.hash(password, 12)
        .then(hashed_password => {
            const new_user = new user_Collection({
                username,
                password: hashed_password
            })
            new_user.save()

            res.json({message: "successfuly register"})
        })
    })
})

// login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) return res.json({error: 'Give all the fields'})

    user_Collection.findOne({ username: username })
    .then(userFound => {
        if(!userFound) return res.json({error: "this user doesn't exist "})

        bcrypt.compare(password, userFound.password)
        .then(match => {
            if(!match) return res.json({error: "this user doesn't exist "})

            const token = JWT.sign({ _id: userFound._id }, JWT_SECRET)

            res.json({
                message: 'successfuly login',
                token
            })
        })

    })
    .catch(err => console.log('auth_router:55:: ', err))
})

module.exports = router;