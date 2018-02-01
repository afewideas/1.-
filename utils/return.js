var info = {
	"succ": {ret_code: 0, ret_data:null},
	"err": {ret_code: -1, ret_msg:null},
	"stat_loginsucc": {ret_code: 0, ret_msg: '登录成功！在消息头中使用新的回话连接。'},
	"stat_logined": {ret_code: 1, ret_msg: '已经登录成功，退出后再登录'},
	"stat_nologin": {ret_code: 3, ret_msg: '请求被阻止，该操作需要身份认证'},
	"stat_logoutsucc": {ret_code: 4, ret_msg: '退出成功！'},
	"err_nologindata": {ret_code: -1, ret_msg: '必须输入账号和密码才能登录'},
	"err_loginproblem": {ret_code: -2, ret_msg: '登录失败，生成回话错误'},
	"err_loginfail": {ret_code: -3, ret_msg: '账号或密码错误'},
	"err_nosession": {ret_code: -4, ret_msg: '会话丢失，服务器发生错误'},
	
};

exports.info = info ;