const User = require('../database/models/User.schema')
const router = require('express').Router();
const bcrypt = require('bcrypt');

const bcryptRounds = 10;

router.post('/signup', (req, res, _next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ errorMessage: 'Please provide username and password' })
    }

    User
        .findOne({ username })
        .then(response => {
            if(response) {
                return res.status(400).json({ errorMessage: 'User already exists' })
            };

            const salt = bcrypt.genSaltSync(bcryptRounds);
            const hashPassword = bcrypt.hashSync(password, salt);

            const user = new User({
                username,
                winsCounter: 0,
                lostCounter: 0,
                password: hashPassword
            })

            user
                .save()
                .then(theUser => {
                    const { _id, username, winsCounter, lostCounter } = theUser;
                    return res.status(200).json({ userData: { _id, username, winsCounter, lostCounter }})
                })
                .catch(() => res.status(500).json({ errorMessage: 'Internal error'}))
        })
});

router.post('/login', (req, res, _next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ errorMessage: 'Please provide username and password' })
    }
    
    User
        .findOne({ username })
        .then(response => {
            if(!response) {
                return res.status(404).json({ errorMessage: 'User not found' })
            };

            if(!bcrypt.compareSync(password, response.password)) {
                return res.status(400).json({ errorMessage: 'Wrong Credentials' })
            };

            const { _id, username, winsCounter, lostCounter } = response;

            return res.status(200).json({ userData: { _id, username, winsCounter, lostCounter } })
        })
        .catch(() => res.status(500).json({ errorMessage: 'Internal error'}))
});

router.put('/update-user/:userID', (req, res, _next) => {
    const { userID } = req.params;
    const { winsCounter } = req.body;

    User
        .findByIdAndUpdate(userID, { winsCounter }, {new: true})
        .then(response => res.status(200).send(response))
        .catch(() => res.status(500).json({ errorMessage: 'Internal error'}))
});

router.get('/all-users', (req, res, _next) => {
    User
        .find()
        .sort({ winsCounter: -1 })
        .then(response => res.status(200).send(response))
        .catch(() => res.status(500).json({ errorMessage: 'Internal error'}))
});
module.exports = router;