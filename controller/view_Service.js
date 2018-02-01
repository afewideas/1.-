var express = require('express');
var router = express.Router();

var validSession = session_util.valid;

var do_res = function(req, res, tpl_name, req_params){
  
  if(typeof(req_params.page) == "undefined"){
    req_params.page = tpl_name;
  }

  //登录状态
  req_params.logged_in = 1;
  var sess = req.session;
  if(sess){
    if(sess.user){
       req_params.logged_in = 1;
    }
  }

  res.render( tpl_name, req_params ) ;

}

router.get('/', function(req, res) {
  
    if (req.query.name){ 
        req.session.login=req.query.name;
    }
    console.log("login="+req.session.login);
    do_res(req, res,'index', {page:'test_index',content: 'hello,你好 world!'});
});

router.get('/home', function(req, res) {
    console.log("home sid="+req.session.id);
    do_res(req, res,"home",{title:req.query.转到主页});
});

router.get('/libs', function(req, res) {
    do_res(req, res,"libs",{title:'控件库'});
});


router.get('/pb', function(req, res) {
    do_res(req, res,'picture_browse',{title:'图片浏览'});
});

// router.get('/explore', function(req, res) {
//     do_res(req, res,"explore",{});
// });

// router.get('/article', function(req, res) {
//     console.log("aaaa");
//     do_res(req, res,"article",{id:req.query.id});
// });


module.exports = router;
