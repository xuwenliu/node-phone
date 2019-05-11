const mongoose = require('../db/db');
const Schema = mongoose.Schema;

//User Schema
let UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 12,
        match: /^[\u4E00-\u9FA5A-Za-z0-9_]{6,12}$/

    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 20,
        match: /^[A-Za-z0-9_]{6,20}$/
    },
    registerTime: {
        type: Number,
        default: 0,
    },
    loginTime: {
        type: Number,
        default: 0,
    }
})



module.exports = {
    User: mongoose.model('User', UserSchema, 'user'),
}