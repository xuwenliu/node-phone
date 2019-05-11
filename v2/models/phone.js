const mongoose = require('../db/db');
const Schema = mongoose.Schema;

//手机品牌 Schema
let BrandSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,

    },
})


//手机型号 Schema
let PhoneModelSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    brandId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,

    },
})

//手机列表 Schema
let PhoneListSchema = new Schema({

    brandId: {
        type: Number,
        required: true
    },
    brandName: {
        type: String,
    },
    typeId: {
        type: Number,
        required: true
    },
    typeName: {
        type: String,
    },
    status: {
        type: Number,
        required: true,
        default: 2, // 1= 在售 2=未售
        max: 2,
        min: 1
    },
    addTime: {
        type: Number,
        required: true,
        default: 0
    },
    updateTime: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = {
    Brand: mongoose.model('Brand', BrandSchema, 'brand'),
    PhoneModel: mongoose.model('PhoneModel', PhoneModelSchema, 'phoneModel'),
    PhoneList: mongoose.model('PhoneList', PhoneListSchema, 'phoneList'),
}