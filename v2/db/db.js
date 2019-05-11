const config = require('./config');
const mongoose = require('mongoose');

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