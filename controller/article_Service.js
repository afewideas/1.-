var express = require('express');
var router = express.Router();

// var validSession = require("./session").valid;

var response = require("./response");

router.get('/write', function(req, res,next) {

	response.mydo(req, res, "article_editor", "article_editor",{title:"写文章",show_header:false,show_footer:false});
	
});

router.get('/:id/modify', function(req, res,next) {

  response.mydo(req, res, "article_editor", "article_editor",{title:"写文章", show_header:false,show_footer:false});
  
});


router.get('/:id', function(req, res,next) {

	// api_client.get('article/'+req.params.id)
	//   .then(function(result) {
	//     response.do(req, res,__filename,{'title':result.body.title, 'initData':JSON.stringify(result.body)});
	//   })
	//   .catch(function(err){
	//     console.log(err);
	//   });
    // response.do(req, res,"article",{});
    response.do(req, res,__filename,{});
});


module.exports = router;
