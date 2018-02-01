var express = require('express');
var router = express.Router();

var path = require('path');
var api_client = require(path.join(util_path,'webapi'));

var response = require("./response");


router.get('/:id', function(req, res) {
	
	api_client.get('user/'+req.params.id)
	  .then(function(result) {
	    response.do(req, res,__filename,{'title':result.body.ret_data.name
	    	,show_footer:false
	    	//, initData:JSON.stringify(result.body.ret_data)
	    });
	  })
	  .catch(function(err){
	    console.log(err);
	  });
    
});



module.exports = router;
