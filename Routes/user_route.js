const express = require('express');
const router = express.Router();
const isLogin = require('../Middlewares/isLogin');
const user_Collection = require('../Models/user_model');

// check the login user permission
router.get('/check_permission', isLogin, (req, res) => {
    user_Collection.findById(req.user._id)
    .then(me => {
        if(!me) return res.json({TokenError: 'you must login!'});

        res.json({ me })
    })
})

// get all users
router.get('/all_users', isLogin, (req, res) => {
    user_Collection.find({ _id: { $ne: req.user._id }})
    .then(users => {
        res.json({ users })
    })
    .catch(err => console.log('no user') )
})

// get active user
router.post('/active_user', (req, res) => {
    const { userId } = req.body;

    if(!userId) return res.json({error: 'no id'})

    user_Collection.findById(userId)
    .then(active_user => {
        if(!active_user) return res.json({error: 'no user with this ID'})
        
        res.json({ active_user })
    })
    .catch(err => console.log('no user') )
})

module.exports = router;