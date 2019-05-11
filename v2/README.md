# hello-vuex 后台- node.js + koa2 + mongodb + mongoose

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### 目录结构 v2版本--主要使用mongoose相关api Schema model 
### mongoose api文档： https://mongoosejs.com/docs/index.html
```
|----db							//跟数据库相关的
     |----config.js				//数据库配置相关
	 |----db.js					//连接数据库
|----models						//mongoose Schema model			
|----routers					//根据业务划分模块-主要来写api
	 |----phone.js				//手机相关api接口
|----node_modules				//依赖包
|----static						//存放静态资源目录
	 |----css	 				//静态css
	 |----img					//静态img
|----views						//模板文件目录
|----app.js						//项目入口文件

```
#### db/config.js
定义数据库相关的配置项
```js
const config = {
    dbUrl: 'mongodb://localhost:27017/', //数据库地址 无密码方式
    dbName:'koa' //数据库名称
}

module.exports = config;
```

#### db/db.js
```js
const config = require('./config'); //导入配置文件
const mongoose = require('mongoose'); 导入mongoose

//连接数据库
mongoose.connect(`${config.dbUrl}${config.dbName}`, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("数据库连接success!");
})
module.exports = mongoose;
```

#### models/phone.js
```js
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

```

#### routers/phone.js
定义了前端接口请求地址 涉及到 get post put delete


#### app.js 
```js
const Koa = require('koa');
const app = new Koa();

const router = require('koa-router')({
    prefix: '/api'//新增父路由, 给路由统一加个前缀 /api
});
const render = require('koa-art-template'); 
const path = require('path');
const staticResource = require('koa-static');
const bodyParser = require('koa-bodyparser');


const phone = require('./routers/phone');

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

//使用phone模块路由
router.use('/phone', phone);

app.use(router.routes()); 
app.use(router.allowedMethods()); 
app.listen(9002);
```
#### 数据库表结构 和前台页面 参见phone.docx
#### 本项目只涉及后台，不涉及前台，前台的参考项目hello-vuex
#### 接下来准备开发 user注册-登录

