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
}, {
    collection: 'brand',
    versionKey: false
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
}, {
    collection: 'phoneModel',
    versionKey: false
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
}, {
    collection: 'phoneList',
    versionKey: false
})

module.exports = {
    Brand: mongoose.model('Brand', BrandSchema),
    PhoneModel: mongoose.model('PhoneModel', PhoneModelSchema),
    PhoneList: mongoose.model('PhoneList', PhoneListSchema),
}