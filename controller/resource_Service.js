
var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var crypto = require('crypto');
var resource = require('./resource');
var return_info = return_util.info;

var data_path = path.join(process.cwd(),require('config').get('data.path'),path.sep);
var resources_path = path.join(data_path, 'resources', path.sep);

router.get('/:id', async function(req, res) {
	
	var fp = await resource.get(req.params.id, req.query.frame,req.query.sharp,req.query.scale);
	if(fp==null){
		res.json(return_info.err);
	}else{
		res.download(fp,req.params.id,function(err){
			if (err) {
		    console.log(err);
			} else {
			//console.log('ok');
			}
		});
	}
});


router.get('/:location/:id', async function(req, res) {
	
	var fp = await resource.get(req.params.location + path.sep + req.params.id, req.query.frame,req.query.sharp,req.query.scale);
	if(fp==null){
		res.json(return_info.err);
	}else{
		res.download(fp,req.params.id,function(err){
			if (err) {
		    console.log(err);
			} else {
			//console.log('ok');
			}
		});
	}
});


var storage = multer.diskStorage({
    //设置上传文件路径
    //直接存放到resource中，不需要移动文件
    destination: function(req, file, cb) {
    	var gp = resource.genPath();
    	cb(null,gp);
    },
    
    //直接存放到resource中，不需要移动文件
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");

        var gp = resource.genFile();
        cb(null, gp + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象。
var upload = multer({
    storage: storage,
});

router.post('/upload', upload.single('file'),function(req, res, next) {
  
	if (req.file) {
        
		var md5sum = crypto.createHash('md5');
		var stream = fs.createReadStream(req.file.path);
		stream.on('data', function(chunk) {
		    md5sum.update(chunk);
		});
		stream.on('end', function() {
		    var str = md5sum.digest('hex').toUpperCase();
		    
		    // console.log('fieldname: ' + req.file.fieldname);
			console.log('originalname: ' + req.file.originalname);
			// console.log('encoding: ' + req.file.encoding);
			// console.log('mimetype: ' + req.file.mimetype);
			console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
			// console.log('destination: ' + req.file.destination);
			console.log('filename: ' + req.file.filename);
			// console.log('filepath: ' + req.file.path);
			if(req.file.destination.startsWith(resources_path)){
				var thispath = req.file.destination.replace(resources_path,'');
				console.log('path: ' + thispath);
			}
			console.log('md5sum: ' + str);

			var rs =  return_info.succ;
			rs.ret_data = {path: thispath, filename: req.file.filename};
		    res.json(rs);
		    
		});
	}else{
		res.json(return_info.err);
	}
  
});

module.exports = router;
