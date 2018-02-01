



//控制器
frameApp.controller('usersettings', function($scope,$http,$location,loadingInterceptor,$rootScope) {
  
  

  //初始化数据
  $scope.initData = function(){
    if (typeof(initData) == "undefined"){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];
      
      $http({
        method: 'GET',
        url: '/api/user/' + id
      }).then(function successCallback(response) {
          $scope.user = response.data.ret_data;
          $scope.user_bak = JSON.parse(JSON.stringify(response.data.ret_data));
    console.log($scope.user.show_message)
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    }else{
      $scope.user = initData;
      
    }

    $scope.err_name = 0;
    $scope.err_login_name = 0;
    $scope.err_email = 0;
    $scope.err_mobile = 0;


  }
  // end 初始化数据

  $scope.loadSettings = function(uid,n){
    
    if($('#settings-item-'+n).hasClass('selected')){return;}

    $('[id^=settings-item]').removeClass('selected');
    $('#settings-item-'+n).addClass('selected');

    $('[id^=settings-content]').removeClass('selected');
    $('#settings-content-'+n).addClass('selected');

  }
 
  

  $scope.upload = function(files){
    var iMaxFilesize = 2097152; //2M
    var oFile = files[0];    //读取文件
    var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    if (!rFilter.test(oFile.type)) {
        alert("文件格式必须为图片");
        return;
    }
    if (oFile.size > iMaxFilesize) {
        alert("图片大小不能超过2M");
        return;
    }

    var fd = new FormData();
    fd.append('file', oFile); 

    $http({
      method: 'POST',
      url: '/resource/upload',
      data: fd,
      headers: {'Content-Type':undefined},
      transformRequest: angular.identity 
    }).then(function successCallback(response) {
      $scope.user['img'] = response.data.ret_data.path + '/' + response.data.ret_data.filename  ;
        
    }, function errorCallback(response) {
        // 请求失败执行代码
    });

  };

  //保存设置
  $scope.save = function(){//alert($scope.user.show_message);return;
    $scope.check();
    if($scope.err_name!=1 &&
        $scope.err_email!=1 &&
        $scope.err_login_name!=1 &&
        $scope.err_mobile!=1){

      var url = $location.absUrl().split("/");
      var id = url[url.length-1];

      $http({
        method: 'PUT',
        url: '/api/user/' + id,
        data: $scope.user
      }).then(function successCallback(response) {
        $rootScope.my_img = logged_in.my_img = $scope.user.img;
        $rootScope.my_name = logged_in.my_name = $scope.user.name;
      }, function errorCallback(response) {
          // 请求失败执行代码
      });    
    }
  };

  $scope.check = function(){
    // alert($scope.user.name+'==='+user_bak.name)

    var check_value = true;
    if($scope.user_bak.name!=='' && $scope.user.name===''){
      $scope.user.name = $scope.user_bak.name
      check_value = false;
    }else if($scope.user_bak.login_name!=='' && $scope.user.login_name===''){
      $scope.user.login_name = $scope.user_bak.login_name; 
      check_value = false;
    }else if($scope.user_bak.email!=='' && $scope.user.email===''){
      $scope.user.email = $scope.user_bak.email
      check_value = false;
    }else if($scope.user_bak.mobile!=='' && $scope.user.mobile===''){
      $scope.user.mobile = $scope.user_bak.mobile
      check_value = false;
    }
    if(!check_value){return;}

    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if(!reg.test($scope.user.email)){
      $scope.err_email = 1;
      $scope.email_err = '邮箱名称不合法！'
    }

    reg = /^([0-9]){11,}/;
    if(!reg.test($scope.user.mobile)){
      $scope.err_mobile = 1;
      $scope.mobile_err = '手机号码是至少11位的数字'
    } 

    reg = /^([a-zA-Z0-9.-_]){2,}/;
    if(!reg.test($scope.user.login_name)){
      $scope.err_login_name = 1;
      $scope.login_name_err = '登录名只能使用英文字母、数字以及. - _'
    } 


   
    $http({
      method: 'POST',
      url: '/api/user/' + $scope.user._id + '/check' ,
      data: {name:$scope.user.name,login_name:$scope.user.login_name,email:$scope.user.email,mobile:$scope.user.mobile}
    }).then(function successCallback(response) {
      if(response.data.ret_data.name==-1){
        $scope.err_name = 1;
        $scope.name_err = '该名称已被注册！';
      }
      if(response.data.ret_data.login_name==-1){
        $scope.err_login_name = 1;
        $scope.login_name_err = '该名称已被注册！'
      }
      if(response.data.ret_data.email==-1){
        $scope.err_email = 1;
        $scope.email_err = '该邮箱已被注册！'
      }
      if(response.data.ret_data.mobile==-1){
        $scope.err_mobile = 1;
        $scope.mobile_err = '该手机已被注册！';
      }
      
    }, function errorCallback(response) {
        console.log(response)
    });
  }

  //更改密码
  $scope.changePassword = function(){
    if($scope.newpass!==$scope.renewpass){
      $scope.err_pass = 1;
      $scope.pass_err = '两次输入的密码不一致';
    }else if($scope.newpass.length<6){
      $scope.err_pass = 1;
      $scope.pass_err = '密码长度不能小于六位';
    }else{
      $scope.user.password = $scope.newpass;
      $("#changePass").modal('hide');
    }
  };

  $scope.setMsg = function(){//alert($scope.user.show_message)
    if($scope.user.show_message){
      // if($scope.user.show_message===0){
      //   $scope.user.show_message = 1 ;
      // }else{
        $scope.user.show_message = false ;
      // }
    }else{//alert(1)
      $scope.user.show_message = true ;
    }
    alert($scope.user.show_message)
  }

}); //controller




//jquery初始化
$(document).ready(function(){
  
  var current_date = getNowFormatDate().split(' ')[0];

  $("#datetimepicker").datetimepicker
  ({
   format: "yyyy-mm-dd",//设置时间格式，默认值: 'mm/dd/yyyy'
  //   weekStart : 0, //一周从哪一天开始。0（星期日）到6（星期六）,默认值0
  //   startDate : "1960-01-01",//可以被选择的最早时间
    endDate : '2010-01-01',//可以被选择的最晚时间
  //   // daysOfWeekDisabled : "0,6",//禁止选择一星期中的某些天，例子中这样是禁止选择周六和周日
    autoclose : true,//当选择一个日期之后是否立即关闭此日期时间选择器
    startView : 2,//点开插件后显示的界面。0、小时1、天2、月3、年4、十年，默认值2
    minView : 2,//插件可以精确到那个时间，比如1的话就只能选择到天，不能选择小时了
    maxView:4,//同理
  //   // todayBtn : true,//是否在底部显示“今天”按钮
  //   todayHighlight : true,//是否高亮当前时间
  //   keyboardNavigation : true,//是否允许键盘选择时间
    language : 'zh-CN',//选择语言，前提是该语言已导入
  //   forceParse : true,//当选择器关闭的时候，是否强制解析输入框中的值。也就是说，当用户在输入框中输入了不正确的日期，选择器将会尽量解析输入的值，并将解析后的正确值按照给定的格式format设置到输入框中
  //   // minuteStep : 5,//分钟的间隔
  //   pickerPosition : "bottom-left",//显示的位置，还支持bottom-left
  //   // viewSelect : 0,//默认和minView相同
  //   showMeridian : true,//是否加上网格
    initialDate : '1985-01-01'//初始化的时间
  
  });


});
//end jquery初始化





function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
} 

function getFormatDate(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
} 