/**
 * 用户管理
 */

var moment = require('moment');

var BaseModel = require('./base_model');
var Schema = require('./mongo').Schema;

var ChatSchema = new Schema({   
  name: String, 
});

function Chat(){
    BaseModel.call(this, 'Chat',ChatSchema);
}
require('util').inherits(Chat, BaseModel); 
exports.Chat = new Chat();


var ChatUserSchema = new Schema({   
  user: Schema.Types.ObjectId,
  talk_user: Schema.Types.ObjectId,
  chat: Schema.Types.ObjectId,
  user_last_date: {type: Date, default: Date.now}
});

function ChatUser(){
    BaseModel.call(this, 'ChatUser',ChatUserSchema);
}
require('util').inherits(ChatUser, BaseModel); 
exports.ChatUser = new ChatUser();


var MessageSchema = new Schema({   
  chat: Schema.Types.ObjectId,
  user: Schema.Types.ObjectId,
  msg: String,
  created_date: {type: Date, default: Date.now} 
});

MessageSchema.options.toObject = MessageSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    ret.created_date = moment(ret.created_date).format('YYYY-MM-DD HH:mm:ss');
    return ret;
  }
}

function Message(){
    BaseModel.call(this, 'Message',MessageSchema);
}
require('util').inherits(Message, BaseModel); 
exports.Message = new Message();
