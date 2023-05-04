const User = require('../models/User.schema');

const getSingleUser = async (username) => {
    const userInfo = await User.findOne({ username })

    return userInfo
}

const loginUser = async username => {
    const userFound = await getSingleUser(username)
    if (userFound) return userFound;

    const user = new User({
        username,
        winsCounter: 0,
        lostCounter: 0
    })

    user
        .save()
        .then(theUser => theUser)
        .catch(err => console.log(err))

    return user
}

module.exports = {
    getSingleUser,
    loginUser,
}