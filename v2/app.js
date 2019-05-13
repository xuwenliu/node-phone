const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')({
    prefix: '/api' // 父路由, 给路由统一加个前缀 /api
});
const render = require('koa-art-template');
const path = require('path');
const staticResource = require('koa-static');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const glob = require('glob');
const cookie = require('koa-cookie');

const config = require('./db/config');




//配置静态资源路径，这里是static目录
app.use(staticResource(__dirname + '/static/'));

//跨域处理
app.use(cors());

//post请求参数处理
app.use(bodyParser());

//cookie 设置
router.use(cookie.default());


//配置koa-art-template模板
render(app, {
    root: path.join(__dirname, 'views'), //模板文件放置的位置，这里是views文件夹下
    extname: '.html', //模板文件后缀名，可以是.art 等，个人喜好
    debug: process.env.NODE_ENV !== 'production', //是否开启debug模式
})

//用户未授权拦截
app.use(async (ctx, next) => {
    let loginUrl = ctx.request.url;
    console.log(loginUrl)
    if (loginUrl === '/api/user/register' || loginUrl === '/api/user/login') {
        await next();
    } else {
        let tooken = ctx.cookies.get('token');
        let {
            authorization
        } = ctx.request.headers;
        if (authorization.split('=')[1] === tooken) {
            await next();
        } else {
            ctx.body = {
                success: false,
                code: 401,
                msg: '用户未授权，请重新登录!'
            }
        }
    }

})

//引入routers下所有的api，并使用
glob.sync(path.resolve(__dirname, './routers', '**/*.js')).forEach(item => {
    let name = path.parse(item).name;
    let func = require(item);
    router.use(`/${name}`, func);
    /*  const phone = require('./routers/phone');
        const user = require('./routers/user');
        //使用phone模块路由
        router.use('/user', user);
        router.use('/phone', phone);
    */
});





app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.port);