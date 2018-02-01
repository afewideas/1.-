
var _instance = null ;//定义初始化_instance
var config = require('config');

module.exports = function(){ //定义单例类
    
    function Class(){
        //redis连接
        var redis = require('redis'),
        RDS_PORT = config.get('redis.port'),          //端口号
        RDS_HOST = config.get('redis.host'),   //服务器IP
        RDS_PWD = config.get('redis.password'),             //密码    
        RDS_OPTS = {};           //设置项
        this.client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
    }

    Class.prototype = {
        constructor : Class,
        getClient: function(){
            return this.client;
        }
    }
    
    this.getInstance = function(){
        if (_instance === null){
            _instance = new Class();
        }
        return _instance;
    }    
}