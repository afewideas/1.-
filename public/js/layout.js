
var frameApp = angular.module('frameApp', []);

//loading拦截器
frameApp.config(["$httpProvider", function ($httpProvider) {   
  $httpProvider.interceptors.push('loadingInterceptor');  
}]); 

frameApp.factory('loadingInterceptor', ["$rootScope", function ($rootScope) {  
  var timestampMarker = {  
    request: function (config) {
  　　　　//http请求之前
      $rootScope.loading = true;  
      return config;  
    },  
    response: function (response) {
　　　　　　//http响应之后
      $rootScope.loading = false;  
      return response;  
    }  
  };  
  return timestampMarker;  
}]);  


//html文本输出过滤器
angular.module('frameApp').filter('to_trusted', 
      ['$sce', function($sce){ 
        return function(text) { 
          return $sce.trustAsHtml(text); 
        }; 
      }]
      );

//实现一个range函数，构造出total指定的整数序列：ng-repeat="i in [] | range:10"
frameApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});

//layout controller
frameApp.controller('layout', function($scope,$http,$rootScope,$location) {

  $rootScope.announcement = 0;

  $scope.initData = function(){

    //设置全局登录状态
    if(logged_in.status==1){

      $rootScope.logged_in = true;  
      $rootScope.my_img = logged_in.my_img;
      $rootScope.my_name = logged_in.my_name;
      $rootScope.my_id = logged_in.my_id;
      $rootScope.socket_conn($location.host()+':'+$location.port());
      live = setInterval(live_check, 1000*60*20);

      $rootScope.show_message = logged_in.show_message;
      // alert($rootScope.show_message)

    }else{

      $rootScope.logged_in = false;
      $rootScope.show_message = false;

    }

  }

  // 页面跳转，打开新窗口
  $rootScope.gotoPage = function(url){
    // window.location=url;
    window.open(url);
  }

  

  $rootScope.login = function(email,password){

    $http({
      method: 'POST',
      url: '/api/user/login' ,
      data: {"email":email,"password":password}
    }).then(function successCallback(response) {
      var rs = response.data;
      if(rs.ret_code===0){
        $rootScope.logged_in = true;
        $rootScope.my_img = rs.ret_data.img;
        $rootScope.my_name = rs.ret_data.name;
        $rootScope.my_id = rs.ret_data.id;
        
        $rootScope.socket_conn($location.host()+':'+$location.port());
        live = setInterval(live_check, 1000*60*20);
        $("#modal-container-login").modal('hide');
      }else{
        $scope.err_login = true;
        $scope.login_err = rs.ret_msg;
        console.log($scope.err_login)
      }
      
    }, function errorCallback(response) {
        console.log(response)
    });
    
  }
  
  $scope.logout = function(){
    $http({
      method: 'GET',
      url: '/api/user/logout' ,
    }).then(function successCallback(response) {
      $rootScope.logged_in = false;
      $rootScope.my_img = null;
      $rootScope.my_name = null;
      $rootScope.my_id = null;
      $rootScope.socket_close();
      clearInterval(live);
    }, function errorCallback(response) {
        console.log(response)
    });

  }
  

  $rootScope.setFollowup = function(user){
    $http({
      method: 'PUT',
      url: '/api/user/' + user._id + "/followup",
      data: {}
    }).then(function successCallback(response) {
      user.additional.my_follow_up = response.data.ret_data;
      
    }, function errorCallback(response) {
        //
    });
  };

  
  $rootScope.socket_conn = function(url){
    if(socket==null){

      socket = io(url);

      

      socket.on('reconnect', function(){
        // console.log('reconnect');
      })

      socket.on('disconnect', function(){
        // console.log('disconnect');
      })

      socket.on('connect', function(){
        socket.emit('setName',$rootScope.my_id);
      })

      socket.on('unread', function(msg){
        $rootScope.announcement = msg;
        $scope.$apply();
      })


      socket.on('system', function(msg){

        if(!$rootScope.show_message){return;}

        msg = JSON.parse(msg);
        $rootScope.announcement = $rootScope.announcement + 1;
        if($rootScope.announcement>99){
          $rootScope.announcement = '···'; //垂直居中，不是句号
        }
        var show_msg = '<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><strong>'+msg.system.msg+'</strong></div><div>来自:系统消息</div>';
        showMsgAlert(show_msg);
        $scope.$apply();
      })

      socket.on('say', function(msg){

        if(!$rootScope.show_message){return;}

        msg = JSON.parse(msg);
        $rootScope.announcement = $rootScope.announcement + 1;
        if($rootScope.announcement>99){
          $rootScope.announcement = '...';
        }
        var show_msg = '<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><strong>'+msg.say.msg+'</strong></div><div>来自:'+msg.say.from_name+'</div>';
        showMsgAlert(show_msg);
        $scope.$apply();
      })

      
      
    }

    
  }

  $rootScope.getSocket = function(){
    return socket;
  }


  $rootScope.socket_close = function(){
    if(socket!=null){
      socket.disconnect();
      socket = null;
    }
  }

  $rootScope.sendMessage = function(message){
    socket.emit('say',message);
  }

  

  var live_check = function(){
    
    $http({
      method: 'POST',
      url: '/api/user/live' ,
      data: {socket:socket.id}
    }).then(function successCallback(response) {
      // console.log('live...')
      
    }, function errorCallback(response) {
        console.log(response)
    });
      
  }



}); //controller
  

//register controller
frameApp.controller('register', function($scope,$http,$rootScope,$location) {


  $scope.checkName = function(){
    if($scope.name!=null){
      $http({
        method: 'POST',
        url: '/api/user/check' ,
        data: {name:$scope.name}
      }).then(function successCallback(response) {
        if(response.data.ret_code==-1){
          $scope.err_name = 1;
        }
        
      }, function errorCallback(response) {
          console.log(response)
      });
    }
  }

  $scope.checkEmail = function(){
    if($scope.email!=null){
      $http({
        method: 'POST',
        url: '/api/user/check' ,
        data: {email:$scope.email}
      }).then(function successCallback(response) {
        if(response.data.ret_code==-1){
          $scope.err_email = 1;
        }
        
      }, function errorCallback(response) {
          console.log(response)
      });
    }
  }

  $scope.checkPassword = function(){
    if($scope.password!=null){
      if($scope.password.length<6){
        $scope.err_password = 1;
      }else{
        $scope.err_password = 0;
      }
    }
  }

  $scope.register = function(){
    $scope.checkEmail();
    $scope.checkName();
    $scope.checkPassword();
    if($scope.err_password===0 && $scope.err_email===0 && $scope.err_name===0){
      if($scope.password!=null && $scope.name!=null && $scope.email!=null){
        $http({
          method: 'POST',
          url: '/api/user/register' ,
          data: {name:$scope.name, email:$scope.email, password:$scope.password}
        }).then(function successCallback(response) {
          if(response.data._id){
            $scope.registered = true;
          }
          
        }, function errorCallback(response) {
            console.log(response)
        });
      }
    }else{
      console.log('no register')

    }
  }



});

$(document).ready(function(){

  //回到顶部
  $("#backtotop").click(function(){
    $("html,body").animate({scrollTop:"0px"},300);
  });

  //显示tips
  $(".float-bar > .float-icon").hover(  
    function () { //mouseover
      var siblings = $(this).nextAll();
      var bottom = siblings.length * 50 + 5;
      $(this).children(".leftballoon-tips").css("bottom",bottom);
      $(this).children(".leftballoon-tips").css("right","65px");
      $(this).children(".leftballoon-tips").css("visibility","visible");
    },  
    function () {//mouseout  
      $(this).children(".leftballoon-tips").css("visibility","hidden");
    }  
  ); 

  $(".float-bar > .float-icon").click(function(){
    $(this).children(".leftballoon-tips").css("visibility","hidden");
  });



});


//隐藏，显示navbar
var p=0,t=0; 
var show_hide_navbar = function(scrolltop){
  p = scrolltop;
  if(t<=p){//下滚
    $("#frame_header").css("visibility","hidden");
    $(".layout-navbar").css("height","2px");  
    // $(".layout-navbar").animate({height:"2px"},100);
  }else{//上滚
    $("#frame_header").css("visibility","visible");
    $(".layout-navbar").css("height","75px"); 
    // $(".layout-navbar").animate({height:"75px"},100);
  }
  setTimeout(function(){t = p;},0);
}


var closeMsgAlert = function(obj){
 
  $(obj).fadeOut("slow", function(){
    $(obj).addClass('none');
  });
  
  
  // $("#msg_alert").fadeOut("slow", function(){
  //   $("#msg_alert_content").addClass('none');
  //   clearTimeout(MsgAlertTimeout);
  // });
}

var hideMsgAlert = function(obj){
  setTimeout(function(){
    $(obj).fadeOut("slow", function(){
      $(obj).addClass('none');
    });
  }, 5000);
  
}

var showMsgAlert = function(msg){
  
  $("div#msg_alert").each(function(){
    if($(this).hasClass('none')){
      $(this).children('#msg_alert_content').html(msg);
      $(this).removeClass('none');
      $(this).fadeIn("slow");
      hideMsgAlert(this);
      return false;
    }

  })

}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
        strHour = "0" + strHour;
    }
    if (strMin >= 0 && strMin <= 9) {
        strMin = "0" + strMin;
    }
    if (strSec >= 0 && strSec <= 9) {
        strSec = "0" + strSec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + strHour + seperator2 + strMin
            + seperator2 + strSec;
    return currentdate;
} 