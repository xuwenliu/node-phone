const router = require('koa-router')();
const moment = require('moment');

const { User } = require('../models/user');



//注册
router.post('/register', async (ctx) => {
    ctx.session.token = '';

    let registerTime = moment().unix();
    let insertData = {
        ...ctx.request.body,
        registerTime,
    }
    try {
        let oldUser = await User.findOne({
            userName: ctx.request.body.userName,
        })
        if (oldUser) { 
            ctx.status = 400;
            ctx.body = {
                success: false,
                msg: '该用户已经存在'
            }
            return;
        }
        let data = await new User(insertData).save();
        ctx.body =  {
            success: true,
            data
        }
    } catch (err) {
        ctx.body = {
            success: false,
            msg: err
        }
    }
})

//登录
router.post('/login', async (ctx) => {
    ctx.session.token = '';
    let { userName, password } = ctx.request.body;
    let loginTime = moment().unix();
    
    try {
        let oldUser = await User.findOne({
            userName,
        })
        if (!oldUser) { 
            ctx.status = 400;
            ctx.body = {
                success: false,
                msg: '不存在该用户!'
            }
            return;
        }
        if (oldUser.password != password) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                msg: '用户名或密码错误!'
            }
            return;
        }
        let updateData = await User.updateOne({ userName }, { loginTime });
        if (updateData.ok === 1) {
            ctx.body =  {
                success: true,
                msg: '登录成功!',
            }
            ctx.session.token = userName;
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            msg: err
        }
    }
})


module.exports = router.routes();