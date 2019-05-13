const router = require('koa-router')();
const moment = require('moment');

const { User } = require('../models/user');



//注册
router.post('/register', async (ctx) => {
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
        let data = await new User(ctx.request.body).save();
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
    let { userName, password } = ctx.request.body;
    let loginTime = moment().unix();
    
    try {
        let oldUser = await User.findOne({
            userName
        })
        if (!oldUser) { 
            ctx.status = 400;
            ctx.body = {
                success: false,
                msg: '不存在该用户!'
            }
            return;
        }
        let isMatch = await User.comparePassword(password, oldUser.password);
        if (!isMatch) { //true or false
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