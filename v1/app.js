const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');//引入
const bodyParser = require('koa-bodyparser');


const phone = require('./modules/phone');

app.use(static(__dirname + '/static/'));//配置静态资源路径，这里是static目录
app.use(bodyParser());

//配置koa-art-template模板
render(app, {
    root: path.join(__dirname, 'views'),//模板文件放置的位置，这里是views文件夹下
    extname: '.html',//模板文件后缀名，可以是.art 等，个人喜好
    debug: process.env.NODE_ENV !== 'production',//是否开启debug模式
})


router.use('/api/phone',phone)


app.use(router.routes()); 
app.use(router.allowedMethods()); 

app.listen(9000);
