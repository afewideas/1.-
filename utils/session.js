
var return_info = return_util.info;

exports.valid = function(req, res, next){
    var sess = req.session;
    if(sess){
		if(sess.user){
			next();
		}else{
			return res.json(return_info.stat_nologin); 
		}
    }else{
    	return res.json(return_info.err_nosession);
    }
    
}