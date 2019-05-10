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

### 目录结构 v1版本
```
|----db							//跟数据库相关的
     |----config.js				//数据库配置相关
	 |----db.js					//操作数据库的方法封装，如：insert,delete,update,find
|----modules					//根据业务划分模块-主要来写api-后续可能会有变动
	 |----phone.js				//第一个手机模块
|----node_modules				//依赖包
|----static						//存放静态资源目录
	 |----css	 				//静态css
	 |----img					//静态img
|----views						//模板文件目录
|----app.js						//项目入口文件

```

