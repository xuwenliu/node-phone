const mongoose = require('../db/db');
const Schema = mongoose.Schema;
const moment = require('moment');

const bcrypt = require('bcrypt');
const SALE_WORK_FACTOR = 10;//加盐强度


//User Schema
let UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true, //用户名不能重复
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
        default: moment().unix(),
    },
    loginTime: {
        type: Number,
        default: 0,
    }
})

UserSchema.pre('save', function (next) {
    this.registerTime = moment().unix();
    bcrypt.genSalt(SALE_WORK_FACTOR, (err, salt) => { //加盐
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => { //加密
            if (err) return next(err);
            this.password = hash;
            next();
        })
    })
})

UserSchema.statics.comparePassword = (_password,password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(_password, password, (err,isMatch) => {
            if (!err) resolve(isMatch);
            else reject(err);
        })
    })
}


module.exports = {
    User: mongoose.model('User', UserSchema, 'user'),
}