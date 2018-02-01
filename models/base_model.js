/**
 * BaseModel类，所有model对象的基类
 */

var mongoose = require('./mongo'),
    Schema = mongoose.Schema;


function BaseModel(name,schema) {
    this.mongoose_model = mongoose.model(name,schema);
    
    this.getMongooseModel = function (){
        return this.mongoose_model;
    }

    this.find = async function(query,projection,sort,skip,limit) {
        return await this.mongoose_model.find(query,projection).sort(sort).skip(skip).limit(limit);
    };

    this.findOne = async function(query,projection,sort,skip,limit) {
        let rs = await this.find(query,projection,sort,skip,limit);
        if(rs.length>0){
            return rs[0];
        }else{
            return null;
        }
    };

    this.findById = async function(id) {
        return await this.mongoose_model.findById(id);
    };

    this.count = async function(query) {
        return await this.mongoose_model.count(query);
    };

    this.create = async function(doc) {
        try{
            let rs = await this.mongoose_model.create(doc);
            return rs;
        }catch(err){
            return {code:err.code, msg:err.errmsg};
        }
    };

    this.insert = async function(docs) {
        try{
            return await this.mongoose_model.insertMany(docs);    
        }catch(err){
            return {code:err.code, msg:err.errmsg};
        }
        
    };

    this.update = async function(query,fields) {
        try{
            //return { ok: 1, nModified: 0, n: 2 }
            return await this.mongoose_model.updateMany(query,fields);    
        }catch(err){
            return {code:err.code, msg:err.errmsg};
        }
        
    };

    this.delete = async function(query) {
        try{
            //{"ok":1,"n":1}
            let rs = await this.mongoose_model.remove(query);  
            return rs.result;  
        }catch(err){
            return {code:err.code, msg:err.errmsg};
        }
        
    };    

    
}


module.exports = BaseModel;