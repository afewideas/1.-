
var path = require('path');
var snowflake = require('node-snowflake').Snowflake;

var data_path = path.join(process.cwd(),require('config').get('data.path'),path.sep);
var resources_path = path.join(data_path, 'resources', path.sep);
var empty_file = resources_path + "empty_file";

fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });

var frame_options = { 
		large:{
			landscape:[620,465],
			portrait:[465,620],
			square:[465,465]
			},
		middle:{
			landscape:[480,360],
			portrait:[360,480],
			square:[360,360]
			},
		small:{
			landscape:[320,240],
			portrait:[240,320],
			square:[240,240]
			},
		micro:{
			landscape:[80,60],
			portrait:[60,80],
			square:[60,60]
			}  
	};

var genFilePath = exports.genFilePath = function(){
	var now = new Date();
	var m = ( now.getMonth() + 1 ).toString();
	if(m.length==1){
		m = '0' + m ;
	}
	var target_path = resources_path + now.getFullYear().toString() + m;
	var filename = snowflake.nextId();
	return {path:target_path, file : filename};
}

var genPath = exports.genPath = function(){
	var now = new Date();
	var m = ( now.getMonth() + 1 ).toString();
	if(m.length==1){
		m = '0' + m ;
	}
	var target_path = resources_path + now.getFullYear().toString() + m;
	return target_path;
}

var genFile = exports.genFile = function(){
	var filename = snowflake.nextId();
	return filename;
}


//递归创建目录 同步方法
var mkdirsSync = exports.mkdirsSync = function(dirname, mode){
    
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirsSync(path.dirname(dirname), mode)){
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

exports.put = function(filename){

	var target = genFilePath();
	var file = target.file;

	if(filename.lastIndexOf('.')!=-1){
		var ext = filename.substring(filename.lastIndexOf('.'));
		file = file + ext;
	}
	
	if(mkdirsSync(target.path, null)){
		
		// 创建读取流
	    var is = fs.createReadStream( filename );
	    // 创建写入流
	    var os = fs.createWriteStream( target.path + path.sep + file );  
	    // 通过管道来传输流
	    is.pipe( os );
	    // is.on('close',function(){
	    // 	return file;
	    // })
	    if(fs.existsSync(file)){
	    	return file;
	    }
	    
	};

	
	
}

//promise风格实现同步调用
exports.get = function(filename, frame, sharp, scale) {

	return new Promise(function(resolve,reject){

	  	var fp = resources_path + filename ;
	  	if(!fs.existsSync(fp)){
	  		resolve(null)
	  	}
  	

	  	if(typeof(frame)=='undefined' || typeof(sharp)=='undefined' || typeof(scale)=='undefined'){
	  		resolve(fp)

	  	}else{

		  	var target = fp + "_" + frame + "_" + sharp ;
		  	if(scale==1){
		  		target = target + "_scale" ;
		  	}

		  	wh = frame_options[frame][sharp];

		  	if(!fs.existsSync(target)){

		  		if(scale != 1){  //从中心点剪裁
			  		imageMagick(fp)
					    .gravity('Center')
					    .crop(wh[0],wh[1],0,0)
					    .autoOrient() 				    
					    .write(target, function(err){
					    	if (err) {
					    		console.log(err);
					    		target = empty_file;
					    	}
					    	
				      		resolve(target)
				  		});
				  		
				}else{ //按比例缩放
					imageMagick(fp)
					    .resize(wh[0],wh[1])
					    .autoOrient()
					    .write(target, function(err){
					    	if (err) {
					    		console.log(err);
					    		target = empty_file;
					    	}
					    	resolve(target)
				  		});
				}

			}else{
				resolve(target)
			}
	  
	 	}


	});
};
