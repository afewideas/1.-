require('should');

var mongoose = require('../models/mongo');
var User = require('../models/user').User;
var Relationship = require('../models/user').Relationship;

describe('User', function() {
	var user;
	before(async function() {
	    user = await User.create({login_name:'testuser_mocha',email:'testuser_mocha@123.net',name:'testuser_mocha',mobile:'12301230123',password:'123456'});
    	// console.log('user=='+user._id)
	});

	after( async function() {
		await User.delete({
			$or:[{login_name:'testuser_mocha'},{email:'testuser_mocha@123.net'},{name:'testuser_mocha'},{mobile:'12301230123'}]});
		
	});

    describe('#create()',  function() {
    	
    	let err_tests = [
    		{ desc:'-1001 due to inserting empty object' , args:{}, expected:-1001 },
    		{ desc:'-1001 due to no password' , args:{login_name:'test1',email:'test1@test.com', mobile:'11111111110'}, expected:-1001 },
    		{ desc:'-1001 due to no login_name and email and mobile' , args:{password:'test1'}, expected:-1001 },
    		{ desc:'-1002 due to password length<6' , args:{login_name:'test1',password:'111'}, expected:-1002 },
    		{ desc:'-1003 due to invalid email format #1' , args:{email:'test1',password:'111111'}, expected:-1003 },
    		{ desc:'-1003 due to invalid email format #2' , args:{email:'test&abc@deyatech.com',password:'111111'}, expected:-1003 },
    		{ desc:'-1003 due to invalid email format #3' , args:{email:'test_abc@de+yatech.com',password:'111111'}, expected:-1003 },
    		{ desc:'-1003 due to invalid email format #4' , args:{email:'test+abc@deyatech.com',password:'111111'}, expected:-1003 },
    		{ desc:'-1004 due to mobile length<11' , args:{mobile:'1112221112',password:'111111'}, expected:-1004 },
    		{ desc:'-1005 due to invalid login_name format' , args:{login_name:'test1哦&',password:'111111'}, expected:-1005 },
    		{ desc:'-1006 due to _id in here' , args:{_id:'1212121221',login_name:'test1',password:'111111'}, expected:-1006 },
    		{ desc:'11000 due to duplicate key - login_name' , args:{login_name:'testuser_mocha',password:'123456'}, expected:11000 },
    		{ desc:'11000 due to duplicate key - email' , args:{email:'testuser_mocha@123.net',password:'123456'}, expected:11000 },
    		{ desc:'11000 due to duplicate key - name' , args:{login_name:'testuser_mocha_for_name',name:'testuser_mocha',password:'123456'}, expected:11000 },
    		{ desc:'11000 due to duplicate key - mobile' , args:{mobile:'12301230123',password:'123456'}, expected:11000 },
    	];

    	err_tests.forEach(function(test){
    		it('should return error code ' + test.desc, async function(){
    			let rs = await User.create(test.args);
	    		rs['code'].should.equal(test.expected);
    		})
    	});

    	let tests = [
    		
    		{ desc:'' , args:{login_name:'test1',email:'test1@test.com', mobile:'11111111110',name:'test1',password:'1234567'} },
    		{ desc:'' , args:{login_name:'test2',email:'test2@test.com', mobile:'11111111111',password:'1234567'} },
    		{ desc:'' , args:{login_name:'test3',email:'test3@test.com',name:'test3',password:'1234567'} },
    		{ desc:'' , args:{login_name:'test4', mobile:'11111111114',name:'test4',password:'1234567'} },
    		{ desc:'' , args:{email:'test5@test.com', mobile:'11111111115',name:'test5',password:'1234567'} },
 
    	];

    	tests.forEach(function(test){
    		it('should return user object ' + test.desc, async function(){
    			let rs = await User.create(test.args);
	    		rs.should.have.property('_id');
	    		await User.delete({_id:rs._id});
    		})
    	}); 
    });

    describe('#insert()',  function() {
    	
    	let tests = [
    			{login_name:'test1',email:'test1@test.com', mobile:'11111111110',name:'test1',password:'1234567'},
    			 {login_name:'test2',email:'test2@test.com', mobile:'11111111111',password:'1234567'},
    			 {login_name:'test3',email:'test3@test.com',name:'test3',password:'1234567'},
    			 {login_name:'test4', mobile:'11111111114',name:'test4',password:'1234567'},
    			 {email:'test5@test.com', mobile:'11111111115',name:'test5',password:'1234567'},

    			 {login_name:'test1',email:'test1@test.com', mobile:'11111111110'},
    			 {login_name:'test1',password:'111'},
    			 {email:'test_abc@de+yatech.com',password:'111111'},
    			 {mobile:'1112221112',password:'111111'},
    			 {login_name:'testuser_mocha_for_name',name:'testuser_mocha',password:'123456'},
    			 {email:'tes@tuser_mocha_for_name',password:'123456'}
    			];

    	it('should return succ list and err list', async function(){
			let rs = await User.insert(tests);
			rs.should.have.property('succ');
			rs.should.have.property('err');
			rs.succ.length.should.equal(5);
			rs.err.length.should.equal(6);
			rs.succ.forEach(async function(obj){
				await User.delete({_id:obj._id});
			})
			
		})   
    });


    describe('#update()',  function() {
    	
    	it('should return error -1003 due to invalid email format', async function(){
			let rs = await User.update({login_name:'testuser_mocha'},{email:'t*estuser_mocha@123.net',name:'testuser_mocha_new'});
			rs.should.have.property('code');
			rs.code.should.equal(-1003);	
		});

    	it('should return error 11000 due to duplicate key - name', async function(){
			let rs = await User.update({},{name:'testuser_mocha'});
			rs.should.have.property('code');
			rs.code.should.equal(11000);
		});

    	it('should return ok', async function(){
			let rs = await User.update({},{identity:'撒范德萨的'});
			rs.should.have.property('ok');
			rs.should.have.property('nModified');
			rs.nModified.should.above(0);
		});
	});


});


describe('Relationship', function() {
	var relationship;
	var oid = mongoose.Types.ObjectId();
	before(async function() {
		relationship = await Relationship.create({user:oid,followups:[],fans:[]});
	});

	after( async function() {
		await Relationship.delete({user:oid});
	    mongoose.disconnect();
	});

    describe('#create()',  function() {
    	
    	it('should return error code 11000', async function(){
    		let rs = await Relationship.create({user:oid,followups:[],fans:[]});
			rs.should.have.property('code');
			rs.code.should.equal(11000);	
		});

		it('should return relationship object', async function(){
    		let rs = await Relationship.create({user:mongoose.Types.ObjectId(),followups:[],fans:[]});
			rs.should.have.property('_id');
			await Relationship.delete({_id:rs._id});
		});
	});

	describe('#insert()',  function() {
    	
    	it('should return error code 11000 and create one data', async function(){
    		let id = mongoose.Types.ObjectId();
    		let rs = await Relationship.insert([
    			{user:id,followups:[],fans:[]},{user:oid,followups:[],fans:[]},
    			]);
			rs.should.have.property('code');
			rs.code.should.equal(11000);
			let drs = await Relationship.delete({user:id});
			drs.should.have.property('ok');
			drs.n.should.equal(1);
		});

		it('should return error code 11000 and create nothing', async function(){
    		let id = mongoose.Types.ObjectId();
    		let rs = await Relationship.insert([
    			{user:oid,followups:[],fans:[]},{user:id,followups:[],fans:[]},
    			]);
			rs.should.have.property('code');
			rs.code.should.equal(11000);
			let drs = await Relationship.delete({user:id});
			drs.should.have.property('ok');
			drs.n.should.equal(0);
		});

		

    	
	});

});


