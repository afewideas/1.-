
var _ = require('underscore');

var redis = getModel('redis')
var redis_client = new redis().getInstance().getClient();

function addMessage(msg, toName){
	redis_client.sadd('message:'+toName,JSON.stringify(msg));
    redis_client.expire('message:'+toName,60*10); //10分钟后清除
}


var message_model = getModel('message');
var user_model = getModel('user');
var message_handler = getModelHandler('message');


var saveMessage = async function(msg){
	console.log(msg);
	return;

	var chat_id;
	if(msg.chat){
		chat_id = msg.chat;
	}else{
		var newchat = await message_model.Chat.create({from: msg.from,to:msg.to});
		chat_id = newchat._id;
	}

	var thismsg = {
		chat: chat_id,
		user: msg.from,
		msg: msg.msg
	} 
	
	// console.log(thismsg);
	await message_model.Message.create(thismsg);
}

var io = null;

module.exports.init = function(server){ 

	if(io!=null){return;}
    
    io  = require('socket.io')(server);
    
    
	io.on('connection', function(socket){
		// var socket_id = socket.id;

		socket.on('disconnect', function(data){
		         
		});
	

		//注册登录用户名
		socket.on('setName',function (data) {
			socket.name = data;

			redis_client.smembers('message:'+socket.name,function(err,res){
				var size = res.length;
				redis_client.smembers('message:system',function(err,res){
	        		size = size + res.length;
	        		socket.emit('unread',size);
	        	})
				
        	});
        	
		});

		//广播系统通知
		socket.on('system',function (data) {

			data['dt'] = (new Date()).toLocaleString();
	        var _msg = {system: data};
	        addMessage(_msg,'system');
			io.sockets.emit('system',JSON.stringify(_msg));
        	
		});

		//聊天，私聊
		socket.on('say',function (data) {

	        var toId = data.to;
	        var toSocket = _.where(io.sockets.sockets,{name:toId}) ;
	        data['dt'] = (new Date()).toLocaleString();
	        var _msg = {say: data};
	        
	        // addMessage(_msg,toName);
	        // saveMessage(data);
	        message_handler.saveMessage(data);
	        //向该用户所有登录的设备发送
	        toSocket.forEach(function(value,i){
        		value.emit('say',JSON.stringify(_msg));

	        })
	        
	    })

	});

}

module.exports.getIO = function(){
	return io;
}
    