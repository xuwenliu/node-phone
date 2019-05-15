const router = require("koa-router")();
const moment = require("moment");

const { User } = require("../models/user");

//注册
router.post("/register", async ctx => {
    let user = ctx.request.body;
    try {
        //1.通过userName 获取userId
        let oldUser = await User.findOne({
            userName: user.userName
        });
        if (oldUser) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                msg: "该用户已经存在"
            };
            return;
        }
        let data = await new User({
            ...user,
            userId: User.setUserId(user.userName)
        }).save();
        if (data) {
            //注册成功后设置cookie-直接登录
            ctx.cookies.set("token", data.userId, {
                maxAge: 86400000, //一天过期时间
                httpOnly: true //是否只是服务器可访问 cookie, 默认是 true
            });

            ctx.body = {
                success: true,
                data,
                token: data.userId
            };
        }
    } catch (err) {
        ctx.body = {
            success: false,
            msg: err
        };
    }
});

//登录
router.post("/login", async ctx => {
    let { userName, password } = ctx.request.body;
    let loginTime = moment().unix();

    try {
        let oldUser = await User.findOne({
            userName
        });
        if (!oldUser) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                msg: "不存在该用户!"
            };
            return;
        }
        let isMatch = await User.comparePassword(password, oldUser.password);
        if (!isMatch) {
            //true or false
            ctx.status = 400;
            ctx.body = {
                success: false,
                msg: "用户名或密码错误!"
            };
            return;
        }
        let updateData = await User.updateOne(
            {
                userName
            },
            {
                loginTime
            }
        );
        if (updateData.ok === 1) {
            //登录成功后设置cookie
            ctx.cookies.set("token", oldUser.userId, {
                maxAge: 86400000, //一天过期时间
                httpOnly: true //是否只是服务器可访问 cookie, 默认是 true
            });
            ctx.body = {
                success: true,
                token: oldUser.userId,
                msg: "登录成功!"
            };
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            msg: err
        };
    }
});

//退出登录
router.post("/logout", async ctx => {
    ctx.cookies.set("token", "", {
        maxAge: 0 //清除cookie
    });
    ctx.body = {
        success: true,
        msg: "退出成功!"
    };
});

module.exports = router.routes();
