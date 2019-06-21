// 用户登录拦截

const Auth = async (ctx, next) => {
    let loginUrl = ctx.request.url;
    if (loginUrl === "/api/user/register" || loginUrl === "/api/user/login" || loginUrl === "/api/phone/face") {
        await next();
    } else {
        let tooken = ctx.cookies.get("token");
        let { authorization } = ctx.request.headers;
        if (authorization && authorization.split("=")[1] === tooken) {
            await next();
        } else {
            ctx.body = {
                success: false,
                code: 401,
                msg: "用户未授权，请重新登录!"
            };
        }
    }
};

module.exports = {
    Auth
};
