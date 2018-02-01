
var config = require('config');
var mongoose = require('mongoose'),
	DB_URL = 'mongodb://'+config.get("mongo.host")+':'+config.get("mongo.port")+'/'+config.get("mongo.db");

/**
 * 连接
 */
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, {
  useMongoClient: true,
  poolSize: config.get("mongo.pool"),
  // promiseLibrary: require('bluebird') 
});

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {    
    // console.log('Mongoose connection open to ' + DB_URL);  
});    

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    
    // console.log('Mongoose connection disconnected');  
});

module.exports = mongoose;