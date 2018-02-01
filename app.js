
//配置文件
var config = require('config');

//导入express模块
var express = require('express');
var app = express();

var server = require('http').Server(app);
var port = process.env.PORT || config.get('server.port');
var hostname = process.env.HOSTNAME || config.get('server.host');

var session = require('express-session');
var cookieParser = require('cookie-parser');
// app.use(express.methodOverride());
app.use(cookieParser());

var RedisStore = require('connect-redis')(session);
app.use(session({
    name: "sssid",
    secret: 'dsfgf214ksdfe5', //secret的值建议使用随机字符串
    resave: false, //强制session保存到session store中。即使在请求中这个session没有被修改。
    saveUninitialized: false, //强制保存没有初始化的session
    cookie: {maxAge: 60 * 1000 * 30}, // 过期时间内只要有请求，就重新计时
    rolling:true, //每个请求都重新设置一个cookie, 否则cookie过期，不能通过刷新session维持登录状态
    store: new RedisStore({
      host: config.get('redis.host'),
      port: config.get('redis.port'),
    }),
}));



//支持json格式
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//OAuth支持
// var OAuthServer = require('express-oauth-server');
// app.oauth = new OAuthServer({
//   model: require('./model'), 
//   grants: ['password', 'authorization_code'],
//   debug: true,
//   accessTokenLifetime: 60 * 60 * 24,
//   clientIdRegex: '^[A-Za-z0-9-_\^]{5,30}$'
// });
// app.use(app.oauth.authorize());
// app.use(function(req, res) {
//   res.send('Secret area');
// });

//设置静态文件路径
var path = require('path');

var public_path = path.join(process.cwd(),config.get('server.view.public'),path.sep);
app.use(express.static(public_path));

//导入模板swig模块
var swig = require('swig');

//设置swig
swig.setDefaults({
    cache: false, //不缓存,开发模式
    //替换{{}}为[[]],避免angular变量冲突
    varControls: ['[[', ']]'] 
})
app.set('view cache', false);
app.engine(config.get('server.view.template'), swig.renderFile);
app.set('view engine', config.get('server.view.template'));  //模板文件后缀
app.set('views', config.get('server.view.path')); //模板文件位置

//global
global.util_path = path.join(process.cwd(),config.get('server.util.path'),path.sep);
global.return_util = require(path.join(global.util_path,'return'));
global.session_util = require(path.join(global.util_path,'session'));
// global.model_path = path.join(process.cwd(),config.get('server.model.path'),path.sep);
global.getModel = function(model){
  return require(path.join(process.cwd(),path.sep,config.get('server.model.path'),path.sep,model));
}

global.getModelHandler = function(handler){
  return require(path.join(process.cwd(),path.sep,config.get('server.model.path'),path.sep,handler+'Handler'));
}

var fs = require('fs');
var controller_path = path.join(process.cwd(),config.get('server.controller.path'),path.sep);
var files = fs.readdirSync(controller_path);
files.forEach((val,index) => {
  if(val.endsWith(config.get('server.controller.type')+".js")){
    var url_path = val.substring(0,val.indexOf(config.get('server.controller.type')+".js"));

    if(url_path=="view"){  //页面逻辑
      url_path = "";
    }
    app.use( "/"+url_path , require(path.join(controller_path,val) ) );
    // console.log('Service '+url_path+' start.');

  }
});

//数据请求api
var webapi_path = path.join(process.cwd(),config.get('server.api.path'),path.sep);
files = fs.readdirSync(webapi_path);
files.forEach((filename) => {
  if(filename.endsWith(".js")){
    app.use( "/api/"+filename.substring(0,filename.indexOf(".js")) , require(path.join(webapi_path,filename) ) );
  }
});

//websocket server初始化
var util_path = path.join(process.cwd(),config.get('server.util.path'),path.sep);
var websocket = require(util_path+'websocket');
websocket.init(server);


//启动服务
if (!config.get('server.cluster')){

  server.listen(port, hostname,function () {
      var host = server.address().address;  //地址
      var port = server.address().port;  //端口
      console.log("应用实例，访问地址为 http://%s:%s", host, port);
    });
}else{

  //初始化集群
  const cluster = require('cluster');
  const numCPUs = require('os').cpus().length;
  if (cluster.isMaster) {
  	// Fork workers.
  	for (var i = 0; i < numCPUs; i++) {
    	cluster.fork();
  	}

  	cluster.on('exit', (worker, code, signal) => {
    	console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
  	});

  	cluster.on('listening', function (worker, address) {
    	console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    });
  } else {
  	console.log('[worker] ' + "start worker ... " + cluster.worker.id);
    // Workers can share any TCP connection
  	// In this case it is an HTTP server
  	server.listen(port, hostname,function () {
    	var host = server.address().address;  //地址
    	var port = server.address().port;  //端口
    	//console.log('worker'+cluster.worker.id+" started.");
  	});
  }

}