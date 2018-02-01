
var mongoose = require('mongoose');
var path = require('path');
var config = require('config');
var article_model = require('./article').Article;
var comment_model = require('./article').Comment;
var favorite_model = require('./article').Favorite;

exports.getArticleById = function(id){
	if(id.length===24){
	    article_model.find({_id:mongoose.Types.ObjectId(id)}).then((data) => {

			if(data.length===1){
				var article = data[0];

				comment_model.find({article:mongoose.Types.ObjectId(id)}).then((comments)=>{
					article['comment'] = comments.length;//console.log(article.c1omment)
					favorite_model.find({object:mongoose.Types.ObjectId(id)}).then((favs)=>{
						article['favorite'] = favs.length;
						return article;
					})
				})
			
			}else{
			return -1;
			}
	    }).catch((err) => {
	      return -3;
	    });
	}else{
		return -2;
	}
}
