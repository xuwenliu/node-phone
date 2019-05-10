const router = require('koa-router')();
const moment = require('moment');
const db = require('../db/db.js');

//获取手机品牌
router.get('/brand', async (ctx) => {
    let data = await db.find('brand');
    if (data) {
        ctx.body = {
            success: true,
            data
        }
    } else {
        ctx.body = {
            success: false,
            msg: '获取手机品牌失败!'
        }
    }
})

//获取手机型号
router.get('/type', async (ctx) => {
    let data = await db.find('phoneModel', {
        brandId: ctx.query.brandId * 1
    });
    if (data) {
        ctx.body = {
            success: true,
            data
        }
    } else {
        ctx.body = {
            success: false,
            msg: '获取手机型号失败!'
        }
    }
})


//获取手机列表
router.get('/list', async (ctx) => {
    let data = await db.find('phoneList');
    if (data) {
        ctx.body = {
            success: true,
            data
        }
    } else {
        ctx.body = {
            success: false,
            msg: '获取手机列表失败!'
        }
    }
})

//添加
router.post('/add', async (ctx) => {

    let brandId = ctx.request.body.brandId;
    let typeId = ctx.request.body.typeId;

    let brandArr = await db.find('brand', {
        id: brandId
    });
    let brandName = brandArr[0].name;

    let typeArr = await db.find('phoneModel', {
        brandId,
        id: typeId
    });
    let typeName = typeArr[0].name;

    let addTime = moment().unix();
    let updateTime = 0;


    let insertData = {
        ...ctx.request.body,
        brandName,
        typeName,
        addTime,
        updateTime
    }

    let data = await db.insert('phoneList', insertData);
    if (data) {
        ctx.body = {
            success: true,
        }
    } else {
        ctx.body = {
            success: false,
            msg: '添加失败！'
        }
    }
})

let validateInfo = async (ctx, id) => {
    if (!id) {
        ctx.body = {
            success: false,
            msg: '参数错误!'
        }
        return false;
    }

    let _id = db.getId(id);
    let findData = await db.find('phoneList', {
        _id
    });
    if (findData.length < 1) {
        ctx.body = {
            success: false,
            msg: '不存在该手机!'
        }
        return false;
    }
    return true;
}


//删除
router.delete('/delete', async (ctx) => {
    let id = ctx.query.id;
    let _id = db.getId(id);

    let validateResult = await validateInfo(ctx, id);
    if (!validateResult) {
        return;
    }

    let data = await db.delete('phoneList', {
        _id
    });
    if (data.result.ok === 1) {
        ctx.body = {
            success: true
        }
    } else {
        ctx.body = {
            success: false,
            msg: '删除失败!'
        }
    }
})

//修改信息
router.get('/info', async (ctx) => {
    let id = ctx.query.id;
    let _id = db.getId(id);
    let findData = await db.find('phoneList', {
        _id
    });
    if (findData.length < 1) {
        ctx.body = {
            success: false,
            msg: '不存在该手机!'
        }
    } else {
        ctx.body = {
            success: true,
            data: findData[0]
        }
    }



})

router.put('/update', async (ctx) => {
    let postData = ctx.request.body;

    //1.判断前端传过来的_id 是否存在
    if (!postData._id) {
        ctx.body = {
            success: false,
            msg: '参数错误!'
        }
        return false;
    }

    //2.通过_id 去phoneList列表查询 是否有该条数据
    let _id = db.getId(postData._id);
    let findData = await db.find('phoneList', {
        _id
    });
    if (findData.length < 1) {
        ctx.body = {
            success: false,
            msg: '不存在该手机!'
        }
        return false;
    } else {
        // 3.存在 
        let addTime = findData[0].addTime;//获取添加时间
        let brandId = postData.brandId;
        let typeId = postData.typeId;
        let status = postData.status;

        //4.通过brandId 去brand表里查询出brandName
        let brandArr = await db.find('brand', {
            id: brandId
        });
        let brandName = brandArr[0].name;

        //5.通过brandId 和 typeId 去phoneModel表里查询出typeName
        let typeArr = await db.find('phoneModel', {
            brandId,
            id: typeId
        });
        let typeName = typeArr[0].name;

        //6.添加 修改时间
        let updateTime = moment().unix();


        let updateData = {
            brandId,
            typeId,
            brandName,
            typeName,
            updateTime,
            status,
            addTime
        }

        //通过_id进行修改数据
        let data = await db.update('phoneList', {
            _id
        }, updateData);
        if (data.result.ok === 1) {
            ctx.body = {
                success: true,
            }
        } else {
            ctx.body = {
                success: false,
                msg: '修改失败！'
            }
        }
    }




})

module.exports = router.routes();