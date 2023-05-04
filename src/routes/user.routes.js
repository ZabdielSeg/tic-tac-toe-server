const User = require('../database/models/User.schema')
const router = require('express').Router();

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
})  
module.exports = router;