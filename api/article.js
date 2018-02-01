var express = require('express');
var router = express.Router();

var validSession = session_util.valid;
var return_info = return_util.info;

var article_model = getModel('article');
var user_model = getModel('user');


router.get('/hot', function(req, res, next) {

  res.json(require("../backend/demo_data").article_hot);

});


router.get('/:id', async function(req, res, next) {

  var id = req.params.id;
  
  if(id.length===24){
    
    var data = await article_model.Article.findById(id);
    if(req.session.user){
      if(req.session.user.id!==data.author.toString()){
        if(data.publish!==1){
          res.json(return_info.err);
          return;
        }
      }
    }
    if(data){
      var article = data.toObject();
      var comments = await article_model.Comment.find({article:id});
      article['comment'] = comments.length;
      var favs = await article_model.Favorite.find({object:id});
      article['favorite'] = favs.length;

      if(req.session.user){
        var myfav = await article_model.Favorite.find({object:req.params.id,user:req.session.user.id});
        article['my_favorite'] = myfav.length;
      }else{
        article['my_favorite'] = 0;
      }

      
      if(req.session.user){
        favs.forEach((item)=>{
          if(item.user===req.session.user.id){
            article['my_favorite'] = 1;
          }
        })
      }

      var user = await user_model.User.findById(article.author);
      var u = user.toObject();
      var my_follow_up = 0;
      if(req.session.user){
        if(u._id.toString()===req.session.user.id){
          my_follow_up = -1;
        }else{
          var isFlw = await user_model.Relationship.isMyFollowup(u._id,req.session.user.id);
          if(isFlw){
            my_follow_up = 1;
          }
          
        }
      }
      u['additional'] = {"my_follow_up":my_follow_up};
      article.author = u;

      if(req.session.user){
        if(req.session.user.id!==article.author._id.toString()){
          article.read = article.read + 1;
          await article_model.Article.update({_id:id},{read: article.read});
        }
      }else{
        article.read = article.read + 1;
        await article_model.Article.update({_id:id},{read: article.read});
      }
      

      res.json(article);

    }else{
      res.json(return_info.err);
    }
    
    
  }else{
    res.json(return_info.err);
  }

});


router.put('/:id', function(req, res, next) {

  var update_fields = {
    title: req.body.article.title,
    content: req.body.article.content,
    modified_date: new Date()
  };

  //从内容中选择一张图片
  var jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const { window } = new JSDOM(`<!DOCTYPE html>`);
  const $ = require('jquery')(window);
  $(req.body.article.content).appendTo('body');
  if($('img')){
    update_fields.img = $('img').attr('src');
  }
  
  article_model.Article.update({_id:req.params.id},update_fields).then((data) => {
    if(data.ok===1){
      res.json(return_info.succ);
    }else{
      res.json(return_info.err);
    }
  }).catch((err) => {
    res.json(err);
  });
  
});


router.post('/add', function(req, res, next) {

  var newarticle = req.body.article;
  if(typeof(newarticle.content)=="undefined"){
    newarticle.content="";
  }
  newarticle.created_date = new Date();
  newarticle.read = 0;
  newarticle.img = "";
  newarticle.publish = 0;
  newarticle.author = req.session.user.id;
  article_model.Article.create(newarticle).then((data)=>{
    var rs = return_info.succ;
    rs.ret_data = data;
    res.json(rs);
  })
 

});





router.get('/:id/comments/:page', async function(req, res, next) {

  var id = req.params.id;
  var page = req.params.page;

  var comment_page = {};
  var count = await article_model.Comment.count({article:id});
  comment_page["comment_count"] = count;
  comment_page["page_index"] = page;
  comment_page["pages"] = Math.ceil(count/20);

  var comments = [];
  var comms = await article_model.Comment.find({article:id},null,{'created_date':-1},page*20,20);

  for (var i in comms){
    var item = comms[i];
    var comm = item.toObject();
    var thum = await article_model.Thumbsup.find({object:comm._id});
    comm['thumbs_up'] = thum.length;

    if(req.session.user){
      var mythum = await article_model.Thumbsup.find({object:comm._id,user:req.session.user.id});
      comm['my_thumbs_up'] = mythum.length;
    }else{
      comm['my_thumbs_up'] = 0;
    }



    var author = await user_model.User.findById(item.author);
    comm['author'] = author.toObject();
    var replys = await article_model.Reply.find({comment:comm._id});
    var replies = [];
    for (var i in replys){
      var item = replys[i].toObject();
      item['author'] = await user_model.User.findById(item.author);  
      replies.push(item);
    }
    
    comm['replies'] = replies;

    comments.push(comm);
  }

  comment_page['comments'] = comments;
  
  
  

  
  res.json(comment_page);

});

//validSession,
router.post('/:id/comment', function(req, res, next) {
  var content = req.body.content;  //从请求正文中获得json对象
  
  var comment = {
    "author": req.session.user.id,
    "article": req.params.id,
    "created_date": new Date(),
    "thumbs_up": 0,
    "content": content,
    "replies": [ ]
  };
  
  article_model.Comment.create(comment).then((data)=>{
    // console.log(data)
    res.json(return_info.succ); 
  });
   
        
});

router.put('/:id/comment/:cid/thumbsup', async function(req, res, next) {
  
  var rs = return_info.succ;
  var rs_data = {};

  var thum = await article_model.Thumbsup.find({user:req.session.user.id,object:req.params.cid});
  if(thum.length===0){
    await article_model.Thumbsup.create({user:req.session.user.id,object:req.params.cid});
    rs_data['my_thumbs_up'] = 1;
  }else{
    await article_model.Thumbsup.delete({user:req.session.user.id,object:req.params.cid});
    rs_data['my_thumbs_up'] = 0;
  }
  
  var cnt = await article_model.Thumbsup.find({object:req.params.cid});
  rs_data['thumbs_up'] = cnt.length;
  rs.ret_data = rs_data;
  res.json(rs); 

  
});


router.put('/:id/comment/:cid/reply', async function(req, res, next) {

  var reply = {
    "author": req.session.user.id,
    "comment": req.params.cid,
    "content": req.body.content
  };
  var data = await article_model.Reply.create(reply);
  
  var rs = return_info.succ;
  res.json(rs);

 
});



router.put('/:id/favorite', async function(req, res, next) {
  
  var rs = return_info.succ;

  if(req.session.user){
    var isFav = await article_model.Favorite.find({user:req.session.user.id,object:req.params.id});
    if(isFav.length===0){
      await article_model.Favorite.create({user:req.session.user.id,object:req.params.id});
      rs.ret_data = 1;
    }else{
      await article_model.Favorite.delete({user:req.session.user.id,object:req.params.id});
      rs.ret_data = 0;
    }
  }else{
    rs.ret_data = 0;
  }
  
  res.json(rs); 
});

router.put('/:id/publish', async function(req, res, next) {
  // var user = req.session.user;
  var rs = return_info.succ;
  var article = await article_model.Article.findById(req.params.id);
  var p = (article.publish===0)?1:0;
  article_model.Article.update({_id:req.params.id},{publish: p })
  rs.ret_data = p;
  res.json(rs); 
});

router.delete('/:id', function(req, res, next) {
  
  article_model.Article.delete({_id:req.params.id});
  res.json(return_info.succ); 
});


module.exports = router;
