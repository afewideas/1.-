/**
 * 用户管理
 */

var message_model = require('./message');
var user_model = require('./user');

module.exports.getChats = async function(user){

  var chats = [];

  var chatusers = await message_model.ChatUser.find({user:user});
  for(var i=0;i<chatusers.length;i++){
    var chatinfo = chatusers[i].toObject();
    var lastmsg = await message_model.Message.find({chat:chatusers[i].chat},{},{created_date:-1},null,1); 
    if(lastmsg.length>0){
      chatinfo['last_msg'] = lastmsg[0];
      chatinfo['last_msg_date'] = lastmsg[0].created_date;
    }

    var talkuser = await user_model.User.findById(chatinfo.talk_user);
    chatinfo['talk_user_name'] = talkuser.name;
    chatinfo['talk_user_img'] = talkuser.img;

    var unread = await message_model.Message.count({chat:chatusers[i].chat, created_date:{$gt:chatusers[i].user_last_date}, user:{$ne:user}}); 
    chatinfo['unread'] = unread ;

    chats.push(chatinfo);
  }

  chats.sort(by("last_msg_date")).reverse();

  return chats;
  
}

//by函数接受一个成员名字符串做为参数
//并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
var by = function(name){
 return function(o, p){
   var a, b;
   if (typeof o === "object" && typeof p === "object" && o && p) {
     a = o[name];
     b = p[name];
     if (a === b) {
       return 0;
     }
     if (typeof a === typeof b) {
       return a < b ? -1 : 1;
     }
     return typeof a < typeof b ? -1 : 1;
   }
   else {
     throw ("error");
   }
 }
}


module.exports.getMessages = async function(user,chat,page){
  var msgs = await message_model.Message.find({chat:chat},null,{created_date:-1},page*10,10);
  await message_model.ChatUser.update({user:user,chat:chat},{user_last_date: new Date()});
  return msgs;
  
}

module.exports.saveMessage = async function(msg){

  var chat_id;
  if(msg.chat){
    chat_id = msg.chat;
  }else{
    var newchat = await message_model.Chat.create({name:''});
    chat_id = newchat._id;
  }

  var users = await message_model.ChatUser.find({chat:chat_id});
  if(users.length>0){
    if(users[0].user.toString()===msg.from ||
      users[0].talk_user.toString()===msg.from){
        var thismsg = {
        chat: chat_id,
        user: msg.from,
        msg: msg.msg
      } 
      
      // console.log(thismsg);
      await message_model.Message.create(thismsg);
    }
  }
  
}

module.exports.closeChat = async function(user,chat){
  await message_model.ChatUser.update({user:user,chat:chat},{user_last_date: new Date()});
}

module.exports.createChat = async function(user,talk_user){
  var newchat = await message_model.Chat.create({name:''});
  await message_model.ChatUser.insert(
    [{user:user,chat:newchat._id,talk_user:talk_user},
    {user:talk_user,chat:newchat._id,talk_user:user}]
    );
  return newchat._id;
}

module.exports.getChat = async function(user,talk_user){
  var chatuser = await message_model.ChatUser.find({user:user,talk_user:talk_user});
  if(chatuser.length>0){
    return chatuser[0].chat;
  }else{
    return null;
  }
}