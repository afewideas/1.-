/**
 * 用户管理
 */

var moment = require('moment');

var BaseModel = require('./base_model');
var Schema = require('./mongo').Schema;

var UserSchema = new Schema({   
  login_name: { type:String, unique: true, sparse:true},
  email: { type:String,unique: true, sparse:true },
  mobile: { type:String,unique: true, sparse:true },
  password: String,
  name: { type:String,unique: true, sparse:true },
  identity: String,
  sex: Number,
  img: String,
  birthday: Date,
  address: String,
  self_introduction: String,
  college: String,
  show_message: Boolean,
  created_date: {type: Date, default: Date.now }
});

UserSchema.options.toObject = UserSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    ret.created_date = moment(ret.created_date).format('YYYY-MM-DD HH:mm:ss');
    ret.birthday = moment(ret.birthday).format('YYYY-MM-DD');
    return ret;
  }
}


var RelationshipSchema = new Schema({   
  user: { type:Schema.Types.ObjectId, unique: true},
  followups: [Schema.Types.ObjectId],
  fans: [Schema.Types.ObjectId]
});

// var OrganizationSchema = new Schema({
// 	_id: {type: String},
// 	path: {type: String},
// });

// var RoleSchema = new Schema({
// 	_id: {type: String},
// 	features: [{type:String}]
// });


function User(){
    BaseModel.call(this, 'User',UserSchema);

    let checkFields = function(doc){

      if( 'password' in doc && doc.password.length<6){
        return {code:-1002,msg:'password length at least 6 chars.'};
      }else if(("email" in doc)){
        var reg = /^([a-zA-Z0-9\._-])+(@)([a-zA-Z0-9])+(\.)([a-zA-Z0-9_-])+$/;
        if(!reg.test(doc.email)){
          return {code:-1003,msg:'email is not valid format.'};
        }
      }else if(("mobile" in doc)){
        var reg = /^([0-9]){11,}/;
        if(!reg.test(doc.mobile)){
          return {code:-1004,msg:'mobile length at least 11 numbers.'};
        }
      }else if(("login_name" in doc)){
        var reg = /^[a-zA-Z0-9\.-_]{2,}$/;
        if(!reg.test(doc.login_name)){
          return {code:-1005,msg:'login_name only use by English letters, number and .-_ .'};
        }
      }
      return {code:0};  
   
    }

    let checkNew = function(doc){

      if(("_id" in doc)){
        return {code:-1006, msg:'wrong key "_id" in object'};
      }

      if( ( ("login_name" in doc) || ("email" in doc) || ("mobile" in doc) ) && ("password" in doc) ){
        return checkFields(doc) ;
      }else{
        return {code:-1001,msg:'login_name/email/mobile and password required.'};
      }
    }


    this.create = async function(doc){
      
      let ck = checkNew(doc);
      if(ck.code===0){
        try{
          return await this.mongoose_model.create(doc); 
        }catch(err){
          return {code:err.code, msg:err.errmsg};
        }
      }else{
        return ck;
      }
    }

    this.insert = async function(docs) {
      let err = [];
      let succ = [];
      for(var i=0;i<docs.length;i++){
        let rs = await this.create(docs[i]);
        if('code' in rs){
          err.push({data:docs[i], err:rs});
        }else{
          succ.push(rs);
        }
      }
      
      return {succ:succ, err:err};
    };

    this.update = async function(query,fields) {
      let ck = checkFields(fields)
      if(ck.code===0){
        try{
          return await this.mongoose_model.updateMany(query,fields);  
        }catch(err){
          return {code:err.code, msg:err.errmsg};
        }
        
      }else{
        return ck;
      }
        
    };
      


}
require('util').inherits(User, BaseModel); 
exports.User = new User();

function Relationship(){
    BaseModel.call(this, 'Relationship',RelationshipSchema);

    

    this.isMyFollowup = async function(user_id,my_id) {
      var myflw = await this.mongoose_model.find({user:my_id},{followups:1});
      if(myflw.length>0){
        var mylist = myflw[0].followups;
        for (var i=0;i<mylist.length;i++) {
          if(mylist[i].toString()===user_id.toString()){
            return true;
          }
        }
      }
      return false;
    }

    this.isMyFan = async function(user_id,my_id) {
      var myfans = await this.mongoose_model.find({user:my_id},{fans:1});
      if(myfans.length>0){
        var mylist = myfans[0].fans;
        for (var i=0;i<mylist.length;i++) {
          if(mylist[i].toString()===user_id.toString()){
            return true;
          }
        }
      }
      return false;
    }


}
require('util').inherits(Relationship, BaseModel); 
exports.Relationship = new Relationship();


// function Organization(){
//     BaseModel.call(this, 'Organization',OrganizationSchema);
// }
// require('util').inherits(Organization, BaseModel); 

// function Role(){
//     BaseModel.call(this, 'Role',RoleSchema);
// }
// require('util').inherits(Role, BaseModel); 



// exports.Organization = new Organization();
// exports.Role = new Role();