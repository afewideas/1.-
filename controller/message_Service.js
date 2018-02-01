var express = require('express');
var router = express.Router();

// var validSession = require("./session").valid;

var response = require("./response");



router.get('/:id', function(req, res) {
	
	response.do(req, res,__filename,{'title':'消息' , show_footer:false  });
    
});



module.exports = router;
