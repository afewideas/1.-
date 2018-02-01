var express = require('express');
var router = express.Router();

var validSession = session_util.valid;
var return_info = return_util.info;

var article_model = getModel('article');
var user_model = getModel('user');

var message_handler = getModelHandler('message');

router.post('/live', function(req, res, next) {
  // var io = require('../websocket').getIO();
  // console.log(new Date().toLocaleString() + '   ' + req.session.id+' io='+io)
  // io.to(req.body.socket).emit('system',JSON.stringify({system:{msg:'当前连接仍然有效！'}}));

  res.json({});
  
});

router.post('/login', function(req, res, next) {
  
  var sess = req.session;
  if(sess.user){
    return res.json(return_info.stat_logined); 
  }else{
    if (typeof(req.body.email)=='undefined' || typeof(req.body.password)=='undefined'){
      return res.json(return_info.err_nologindata);
    }else{
      
      req.session.regenerate(function(err) { 
        if(err){
          return res.json(return_info.err_loginproblem);        
        }else{
          user_model.User.find({email:req.body.email,password:req.body.password}).then((data)=>{
            
            if(data.length===1){
              req.session.user = {id:data[0]._id,name:data[0].name,img:data[0].img, show_message:data[0].show_message};
              // console.log(req.session.user)
              var rs = return_info.stat_loginsucc;
              var rs_data = req.session.user;
              rs['ret_data'] = rs_data;
              return res.json(rs); 
            }else if(data.length===0){
              var rs = return_info.err;
              rs.ret_msg = '登录名或密码错误!';
              return res.json(rs);
            }else{
              var rs = return_info.err;
              rs.ret_msg = '有多个同名用户!';
              return res.json(rs);
            }
          }).catch((err)=>{
            console.log(err)
            var rs = return_info.err;
            rs.ret_msg = err;
            return res.json(rs);
          })
          
        }
      });


    }
  }
});

router.get('/logout', validSession,function(req, res, next) {

  req.session.destroy(function(err) {
    if(err){
      console.log(err);
    }else{
      res.json(return_info.stat_logoutsucc);
    }
  });
  
});

router.get('/:id', async function(req, res, next) {

  var data = await user_model.User.find({_id:req.params.id});
  if(data.length===0){
    res.json(return_info.err);
  }else{
    var user = data[0].toObject();

    var query = {author:user._id, publish:1};
    if(req.session.user){
      if(req.session.user.id===user._id.toString()){
        query = {author:user._id};
      }
    }

    user['articles'] = await article_model.Article.count(query);
    
    var relationsh = await user_model.Relationship.find({user:user._id});
    if(relationsh.length>0){
      user['followups'] = relationsh[0].followups.length;
      user['fans'] = relationsh[0].fans.length;
    }else{
      user['followups'] = 0;
      user['fans'] = 0;
    }
    
    
    user['additional'] = {};
    if(req.session.user){
      if(req.params.id===req.session.user.id){ //我的主页
        user['additional'] = {my_follow_up:-1};
      }else{ 
        user['additional'] = {my_follow_up:0};
        var isFlw = await user_model.Relationship.isMyFollowup(user._id,req.session.user.id);
        if(isFlw){ //我关注了
          user['additional'] = {my_follow_up:1};
          var isFan = await user_model.Relationship.isMyFan(user._id,req.session.user.id);
          if(isFan){ //是我的粉丝
            user['additional'] = {my_follow_up:2};
          }
        }
        
      }
    }
    
    var rs = return_info.succ;
    rs.ret_data = user;
    // console.log(user)
    res.json(rs); 

  }
  
});

router.get('/:id/articles', async function(req, res, next) {

  var rs = return_info.succ;
  var query = {author:req.params.id,publish:1};
  if(req.session.user){
    if(req.session.user.id===req.params.id){
      query = {author:req.params.id};
    }
  }
  var data = await article_model.Article.find(query,null,{'created_date':-1});
  // console.log(data)
  var articles = [];
  for(var i in data){
    var article = data[i].toObject();
    var jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    const { window } = new JSDOM(`<!DOCTYPE html>`);
    const $ = require('jquery')(window);
    $(article['content']).appendTo('body');
    
    article['summary'] = $('body').text().substring(0,80);//console.log('body text = '+$('body').text())

    article['comment'] = await article_model.Comment.count({article:article._id});
    article['favorite'] = await article_model.Favorite.count({object:article._id});

    articles.push(article);

  }
  
  rs.ret_data = articles ;
  // console.log(rs.ret_data)
  res.json(rs); 
  
});


router.get('/:id/followups', async function(req, res, next) {
  var rs = return_info.succ;
  var flws = await user_model.Relationship.find({user:req.params.id},{followups:1});

  if(flws.length>0){
    var data = [];
    var list = flws[0].followups;
    for (var i =0;i<list.length;i++) {
      var uid = list[i];
      var _user = await user_model.User.findById(uid);
      var user = _user.toObject();
      var relationship = await user_model.Relationship.find({user:user._id});
      if(relationship.length>0){
        var r = relationship[0];
        user['followup'] = r.followups.length;
        user['fans'] = r.fans.length;
      }else{
        user['followup'] = 0;
        user['fans'] = 0;
      }
      var article = await article_model.Article.find({author:user._id});
      user['article'] = article.length;

      user['additional'] = {my_follow_up: 0};
      if(req.session.user){
        if(req.session.user.id.toString()===user._id.toString()){
          user['additional']['my_follow_up'] = -1;
        }else{
          var isF = await user_model.Relationship.isMyFollowup(user._id,req.session.user.id);
          var isFan = await user_model.Relationship.isMyFan(user._id,req.session.user.id);
          if(isF){
            user['additional']['my_follow_up'] = 1;
            if(isFan){
              user['additional']['my_follow_up'] = 2;
            }
          }
        }
      } 
      data.push(user);
    }
    rs.ret_data = data;
    
  }else{
    rs.ret_data = [];
  }

  res.json(rs); 
  
});


router.get('/:id/fans', async function(req, res, next) {
  var rs = return_info.succ;
  var fans = await user_model.Relationship.find({user:req.params.id},{fans:1});

  if(fans.length>0){
    var data = [];
    var list = fans[0].fans;
    for (var i =0;i<list.length;i++) {
      var uid = list[i];
      var _user = await user_model.User.findById(uid);
      var user = _user.toObject();
      var relationship = await user_model.Relationship.find({user:user._id});
      if(relationship.length>0){
        var r = relationship[0];
        user['followup'] = r.followups.length;
        user['fans'] = r.fans.length;
      }else{
        user['followup'] = 0;
        user['fans'] = 0;
      }
      var article = await article_model.Article.find({author:user._id});
      user['article'] = article.length;

      user['additional'] = {my_follow_up: 0};
      if(req.session.user){
        if(req.session.user.id.toString()===user._id.toString()){
          user['additional']['my_follow_up'] = -1;
        }else{
          var isF = await user_model.Relationship.isMyFollowup(user._id,req.session.user.id);
          var isFan = await user_model.Relationship.isMyFan(user._id,req.session.user.id);
          if(isF){
            user['additional']['my_follow_up'] = 1;
            if(isFan){
              user['additional']['my_follow_up'] = 2;
            }
          }
        }
      } 
      data.push(user);
    }
    rs.ret_data = data;
    
  }else{
    rs.ret_data = [];
  }

  res.json(rs); 

  
});


router.put('/:id/followup', async function(req, res, next) {

  var rs = return_info.succ;

  var isFlw = await user_model.Relationship.find({user:req.session.user.id});
  if(isFlw.length===0){
    var data = await user_model.Relationship.create({user:req.session.user.id,followups:[req.params.id]});
    rs.ret_data = 1;
  }else{
    var flws = isFlw[0].followups.toObject();
    var findit = null;
    for(var i in flws){
      if(flws[i].toString()===req.params.id){
        findit = flws[i];
        break;
      }
    }
    if(findit===null){
      var add = await user_model.Relationship.update({user:req.session.user.id},{'$push':{followups:req.params.id}});
      await user_model.Relationship.update({user:req.params.id},{'$push':{fans:req.session.user.id}});
      rs.ret_data = 1;
    }else{
      var del = await user_model.Relationship.update({user:req.session.user.id},{'$pull':{followups:findit}});
      var fans = await user_model.Relationship.find({user:req.params.id});
      if(fans.length>0){
        var fs = fans[0].fans.toObject();
        var findit = null;
        for(var i in fs){
          if(fs[i].toString()===req.session.user.id){
            findit = fs[i];
            break;
          }
        }
        if(findit!==null){
          await user_model.Relationship.update({user:req.params.id},{'$pull':{fans:findit}});
        }
      }
      
      rs.ret_data = 0;
    }
  }
  res.json(rs); 


});

router.post('/check', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  if(typeof(name)!='undefined' && name!=''){
    user_model.User.find({name:name}).then((rs)=>{
      
      if(rs.length===0){
        res.json(return_info.succ);
      }else{
        res.json(return_info.err);
      }
    })
  }else if(typeof(email)!='undefined' && email!=''){
    user_model.User.find({email:email}).then((rs)=>{
      if(rs.length===0){
        res.json(return_info.succ);
      }else{
        res.json(return_info.err);
      }
    })
 
  }else{
    res.json(return_info.err)
  }

});

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  user_model.User.create(req.body).then((rs)=>{
    res.json(rs);
  })
});

router.put('/:id', function(req, res, next) {

  user_model.User.update({_id:req.params.id},req.body).then((rs)=>{
    req.session.user.name = req.body.name;
    req.session.user.img = req.body.img;
    res.json(return_info.succ);
  })
});

router.post('/:id/check', async function(req, res, next) {

  var rs = return_info.succ;
  var rd = {name:1,login_name:1,email:1,mobile:1};
  // console.log(rd)
  if(req.body.name){
    var rs_name = await user_model.User.find({name:req.body.name,_id:{$ne: req.params.id}});
    if(rs_name.length!==0){
      rd.name = -1;
    }
  }

  if(req.body.login_name) {
    var rs_loginname = await user_model.User.find({login_name:req.body.login_name,_id:{$ne: req.params.id}});
    if(rs_loginname.length!==0){
      rd.login_name = -1;
    }
  }

  if(req.body.mobile){
    var rs_mobile = await user_model.User.find({mobile:req.body.mobile,_id:{$ne: req.params.id}});
    if(rs_mobile.length!==0){
      rd.mobile = -1;
    }
  }

  if(req.body.email){
    var rs_email = await user_model.User.find({email:req.body.email,_id:{$ne: req.params.id}});
    if(rs_email.length!==0){
      rd.email = -1;
    }
  }

  rs.ret_data = rd;
  res.json(rs);

});


router.get('/:id/chats', async function(req, res, next) {

  var chats = await message_handler.getChats(req.params.id);
  
  var rs = return_info.succ;
  rs.ret_data = chats;
  res.json(rs);
  
});

router.get('/:id/chat/:chatid/messages/page/:page', async function(req, res, next) {

  var msg_data = await message_handler.getMessages(req.params.id,req.params.chatid,req.params.page);
  // console.log(msg_data)
  var rs = return_info.succ;
  rs.ret_data = msg_data;
  res.json(rs);
  
});

router.put('/:id/chat/:chatid/close', async function(req, res, next) {

  await message_handler.closeChat(req.params.id,req.params.chatid);
  
  var rs = return_info.succ;
  res.json(rs);
  
});

router.get('/:id/chat/talkto/:talkuser', async function(req, res, next) {

  var chat = await message_handler.getChat(req.params.id,req.params.talkuser);
  if(chat===null){
    chat = await message_handler.createChat(req.params.id,req.params.talkuser);
  }
  
  
  var rs = return_info.succ;
  rs.ret_data = chat
  res.json(rs);
  
});




module.exports = router;
