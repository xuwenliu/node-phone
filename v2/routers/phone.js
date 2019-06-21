const router = require("koa-router")();
const moment = require("moment");

const { PhoneList, Brand, PhoneModel } = require("../models/phone");
const { PAGE, PAGE_SIZE } = require("../constant/constant");

const xlsx = require('node-xlsx');
var sheets = xlsx.parse('static/face.xlsx');//获取到所有sheets

//读取excel文件内容
router.get('/face', async (ctx) => {
    var str = '';
    sheets.forEach(function (sheet) {
        for(var rowId in sheet['data']){
            var row=sheet['data'][rowId];
            str += `${row[2]},`;
        }
    });
    ctx.body = {
        success: true,
        data:str.split(','),
    };
})


//获取手机品牌
router.get("/brand", async ctx => {
    await Brand.find({}, (err, data) => {
        if (err) {
            ctx.body = {
                success: false,
                msg: err
            };
        } else {
            ctx.body = {
                success: true,
                data
            };
        }
    });
});

//获取手机型号
router.get("/type", async ctx => {
    await PhoneModel.find(
        {
            brandId: ctx.query.brandId * 1
        },
        (err, data) => {
            if (err) {
                ctx.body = {
                    success: false,
                    msg: err
                };
            } else {
                ctx.body = {
                    success: true,
                    data
                };
            }
        }
    );
});

//获取手机列表
router.get("/list", async ctx => {
    try {
        let page = ctx.query.page * 1 || PAGE;
        let pageSize = ctx.query.pageSize * 1 || PAGE_SIZE;
        let totalCount = await PhoneList.find({}).countDocuments();
        let data = await PhoneList.find({}).skip((page - 1) * pageSize).limit(pageSize);
        ctx.body = {
            success: true,
            data,
            page,
            pageSize,
            totalCount
        };
    } catch (err) {
        ctx.body = {
            success: false,
            msg: err
        };
    }
   
    
});

//添加
router.post("/add", async ctx => {
    let { brandId, typeId } = ctx.request.body;

    let brandObj = await Brand.findOne({
        id: brandId
    });
    let brandName = brandObj.name;

    let typeObj = await PhoneModel.findOne({
        brandId,
        id: typeId
    });
    let typeName = typeObj.name;

    let addTime = moment().unix();

    let insertData = {
        ...ctx.request.body,
        brandName,
        typeName,
        addTime
    };
    try {
        let data = await new PhoneList(insertData).save();
        ctx.body = {
            success: true,
            data
        };
    } catch (err) {
        ctx.body = {
            success: false,
            msg: err
        };
    }
});

//删除
router.delete("/delete", async ctx => {
    let _id = ctx.query.id;
    try {
        let data = await PhoneList.deleteOne({
            _id
        });
        ctx.body = {
            success: true,
            data
        };
    } catch (err) {
        ctx.body = {
            success: false,
            msg: err
        };
    }
});

//修改信息
router.get("/info", async ctx => {
    let _id = ctx.query.id;
    try {
        let findData = await PhoneList.findOne({
            _id
        });
        ctx.body = {
            success: true,
            data: findData
        };
    } catch (err) {
        ctx.body = {
            success: false,
            msg: err
        };
    }
});

//修改
router.put("/update", async ctx => {
    let { _id, brandId, typeId, status } = ctx.request.body;

    //1.通过brandId 去brand表里查询出brandName
    let brandObj = await Brand.findOne({
        id: brandId
    });
    let brandName = brandObj.name;

    //2.通过brandId 和 typeId 去phoneModel表里查询出typeName
    let typeObj = await PhoneModel.findOne({
        brandId,
        id: typeId
    });
    let typeName = typeObj.name;

    //3.修改时间
    let updateTime = moment().unix();

    let updateData = {
        brandId,
        typeId,
        brandName,
        typeName,
        updateTime,
        status
    };

    //4.通过_id进行修改数据
    try {
        let data = await PhoneList.updateOne(
            {
                _id
            },
            updateData
        );
        ctx.body = {
            success: true,
            data
        };
    } catch (err) {
        ctx.body = {
            success: false,
            msg: err
        };
    }
});

module.exports = router.routes();
