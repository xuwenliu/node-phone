const config = require('./config');
const mongoose = require('mongodb');
const MongoClient = mongoose.MongoClient;

class Db {
    constructor() {
        this.dbClient = "";
        this.connect();
    }
    static getDb() {
        if (!Db.isHaveDb) {
            Db.isHaveDb = new Db();
        }
        return Db.isHaveDb;
    }

    //连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                MongoClient.connect(config.dbUrl, (err, client) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.dbClient = client.db(config.dbName); //数据库db对象
                    resolve(this.dbClient);
                })
            } else {
                resolve(this.dbClient);
            }
        })
    }

    /**
     * 
     * @param {*} collectionName 表名
     * @param {*} data 插入的数据 Object/Array
     */
    insert(collectionName, data) {
        return new Promise((resolve, reject) => {
            if (data instanceof Array) { //如果data是数组，代表插入多条数据
                this.connect().then(db => {
                    db.collection(collectionName).insertMany(data, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    })
                })
            } else if (data instanceof Object) { //如果data是对象，代表插入一条数据
                this.connect().then(db => {
                    db.collection(collectionName).insertOne(data, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    })
                })
            }

        })
    }

    /**
     * 
     * @param {*} collectionName 表名
     * @param {*} query 删除条件object
     */
    delete(collectionName, query) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).deleteOne(query, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                })
            })
        })
    }

    /**
     * 
     * @param {*} collectionName 表名
     * @param {*} source 需要修改的源
     * @param {*} target 需要修改为什么
     */
    update(collectionName, source, target) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(source, {
                    $set: target
                }, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                })
            })
        })
    }

    /**
     * 
     * @param {*} collectionName 表名
     * @param {*} query 查询条件object
     */
    find(collectionName, query) {
        return new Promise((resolve, reject) => {
            query = query || {};
            this.connect().then(db => {
                let result = db.collection(collectionName).find(query);
                result.toArray((err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(data);
                })
            })
        })
    }

    getId(id) {
        return new mongoose.ObjectID(id);
    }
}

module.exports = Db.getDb();