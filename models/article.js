/**
 * article
 */
var moment = require('moment');

var mongoose = require('./mongo'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({    
    title : String ,  
    created_date : { type: Date, default:Date.now},
    modified_date: { type: Date, default:Date.now},
    read: Number,
    img: String,
    publish: Number,
    label: [String],
    author: Schema.Types.ObjectId, 
    content: String

});
ArticleSchema.options.toObject = ArticleSchema.options.toJSON = {

  transform: function(doc, ret, options) {
    
    ret.created_date = moment(ret.created_date).format('YYYY-MM-DD HH:mm:ss');
    ret.modified_date = moment(ret.modified_date).format('YYYY-MM-DD HH:mm:ss');
    
    return ret;
  }
}

var CommentSchema = new Schema({
    article: Schema.Types.ObjectId,   
    author: Schema.Types.ObjectId, 
    created_date : { type: Date, default:Date.now},
    content: String
});

CommentSchema.options.toObject = CommentSchema.options.toJSON = {

  transform: function(doc, ret, options) {
    
    ret.created_date = moment(ret.created_date).format('YYYY-MM-DD HH:mm:ss');
    
    return ret;
  }
}

var ReplySchema = new Schema({   
    comment: Schema.Types.ObjectId, 
    author: Schema.Types.ObjectId, 
    created_date : { type: Date, default:Date.now},
    content: String
});

ReplySchema.options.toObject = ReplySchema.options.toJSON = {

  transform: function(doc, ret, options) {
    
    ret.created_date = moment(ret.created_date).format('YYYY-MM-DD HH:mm:ss');
    
    return ret;
  }
}

var FavoriteSchema = new Schema({   
    user: Schema.Types.ObjectId, 
    object: Schema.Types.ObjectId, 
});

var ThumbsupSchema = new Schema({   
    user: Schema.Types.ObjectId, 
    object: Schema.Types.ObjectId, 
});



var BaseModel = require('./base_model');

function Article(){
    BaseModel.call(this, 'Article',ArticleSchema);
}
require('util').inherits(Article, BaseModel); //继承BaseModel
exports.Article = new Article();

function Comment(){
    BaseModel.call(this, 'Comment',CommentSchema);
}
require('util').inherits(Comment, BaseModel); 
exports.Comment = new Comment();

function Reply(){
    BaseModel.call(this, 'Reply',ReplySchema);
}
require('util').inherits(Reply, BaseModel); 
exports.Reply = new Reply();

function Favorite(){
    BaseModel.call(this, 'Favorite',FavoriteSchema);
}
require('util').inherits(Favorite, BaseModel); 
exports.Favorite = new Favorite();

function Thumbsup(){
    BaseModel.call(this, 'Thumbsup',ThumbsupSchema);
}
require('util').inherits(Thumbsup, BaseModel); 
exports.Thumbsup = new Thumbsup();



