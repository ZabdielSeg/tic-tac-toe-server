const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: String,
        winsCounter: Number,
        lostCounter: Number
    },
    {
        timestamps: true
    }
);

const User = model('User', userSchema);
module.exports = User;