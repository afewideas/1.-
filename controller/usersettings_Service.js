var express = require('express');
var router = express.Router();

// var validSession = require("./session").valid;

var response = require("./response");



router.get('/:id', function(req, res) {
	
	response.mydo(req, res,"usersettings", "usersettings",{'title':'设置'   });
    
});



module.exports = router;
