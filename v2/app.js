const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')({
    prefix: '/api'// 父路由, 给路由统一加个前缀 /api
});
const render = require('koa-art-template');
const path = require('path');
const staticResource = require('koa-static');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');


const phone = require('./routers/phone');
const user = require('./routers/user');

//配置静态资源路径，这里是static目录
app.use(staticResource(__dirname + '/static/'));

//post请求参数处理
app.use(bodyParser());

//配置koa-art-template模板
render(app, {
    root: path.join(__dirname, 'views'),//模板文件放置的位置，这里是views文件夹下
    extname: '.html',//模板文件后缀名，可以是.art 等，个人喜好
    debug: process.env.NODE_ENV !== 'production',//是否开启debug模式
})

app.keys = ['some secret hurr'];
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));



//使用phone模块路由

router.use('/user', user);

app.use(async (ctx, next) => {
    console.log(ctx.session)
    if (ctx.session.token) {
        await next();
    } else {
        ctx.body = {
            success: false,
            msg:'用户未授权！请重新登录'
        }
        return;
    }
})

router.use('/phone', phone);



app.use(router.routes()); 
app.use(router.allowedMethods()); 
app.listen(9002);
