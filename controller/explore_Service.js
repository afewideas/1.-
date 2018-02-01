var express = require('express');
var router = express.Router();

// var validSession = require("./session").valid;

var response = require("./response");


router.get('/', function(req, res) {
	
	response.do(req, res,__filename,{'title':"首页"});
	
});


module.exports = router;
