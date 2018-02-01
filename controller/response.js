
exports.do = function(req, res, page, req_params){
  
  var tpl_name = "layout";

  var path = page.split("/");
  var pname = page;
  if(pname.endsWith("_Service.js")){
    pname = path[path.length-1].split("_")[0]; 
  }
  
  execute_do(req,req_params, pname);
  

  res.render( tpl_name, req_params ) ;

}

exports.mydo = function(req, res, tpl_name, page, req_params){
  
  execute_do(req,req_params, page);

  res.render( tpl_name, req_params ) ;

}

var execute_do = function(req,req_params, pname){
  if(typeof(req_params.page) == "undefined"){
    req_params.page = pname;
  }
  
  if(typeof(req_params.initData) == "undefined"){
    req_params.initData = null;
  }

  if(typeof(req_params.show_header) == "undefined"){
    req_params.show_header = true;
  }

  if(typeof(req_params.show_footer) == "undefined"){
    req_params.show_footer = true;
  }


  //登录状态
  var sess = req.session;
  if(sess){
    if(sess.user){
       req_params.logged_in = JSON.stringify({status:1, my_img:sess.user.img,my_name:sess.user.name,my_id:sess.user.id, show_message:sess.user.show_message});
      

    }else{
      req_params.logged_in = JSON.stringify({status:0, my_img:null,my_name:null,my_id:null});
    }
  }

}


