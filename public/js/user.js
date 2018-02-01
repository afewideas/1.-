



//控制器
frameApp.controller('user', function($scope,$http,$location,loadingInterceptor,$rootScope) {
  
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
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    }else{
      $scope.user = initData;
      
    }

    $scope.getArticles();

  }
  // end 初始化数据

  $scope.getArticles = function(){
    // if(!$("#article_list").hasClass("load")){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];
        
      $http({
        method: 'GET',
        url: '/api/user/' + id + "/articles"
      }).then(function successCallback(response) {
          $scope.user_articles = response.data.ret_data;
          $scope.user.articles = $scope.user_articles.length;
          $($scope.user_articles).each(function(i,item){
            item.summary = item.summary.substring(0,80);
            console.log('ssssssssssss='+item.content)
          });
          // $("#article_list").addClass("load");
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    // }

  }
 
  $scope.getFollowups = function(){
    // if(!$("#followup_list").hasClass("load")){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];
        
      $http({
        method: 'GET',
        url: '/api/user/' + id + "/followups"
      }).then(function successCallback(response) {
          $scope.user_followups = response.data.ret_data;
          $scope.user.followups = $scope.user_followups.length;
          console.log($scope.user_followups)
          // $("#followup_list").addClass("load");
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    // }
  }

  $scope.getFans = function(){
    // if(!$("#fans_list").hasClass("load")){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];
        
      $http({
        method: 'GET',
        url: '/api/user/' + id + "/fans"
      }).then(function successCallback(response) {
          $scope.user_fans = response.data.ret_data;
          $scope.user.fans = $scope.user_fans.length;
          // $("#fans_list").addClass("load");
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    // } 
    
  }

  $scope.publishArticle = function(aid){
    $http({
      method: 'PUT',
      url: '/api/article/' + aid + "/publish"
    }).then(function successCallback(response) {
        $($scope.user_articles).each(function(i,item){
          if(item._id==aid){
            item.publish = response.data.ret_data;
          }
        });
        
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
  }

  $scope.deleteArticle = function(aid){
    $http({
      method: 'DELETE',
      url: '/api/article/' + aid 
    }).then(function successCallback(response) {
      // $("#article_list").removeClass("load");
      $scope.getArticles();
        
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
  }


  //监控登录状态
  $scope.$watch('logged_in',  function(newValue, oldValue) {

    if (newValue === oldValue) { return; } 
     
    $scope.initData();


  });

  $scope.closeChat = function(){
    $('#message-content').css('visibility','hidden');
    $('div[id=msg_list_view]').css('visibility','hidden');
    $('#more_msg').css('visibility','hidden');

    $rootScope.show_message = true;
    
    $http({
      method: 'PUT',
      url: '/api/user/' + $scope.my_id + '/chat/' + $scope.thischat + '/close'
    }).then(function successCallback(response) {
        // console.log(response.data.ret_data) ;
        
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
  }

  $scope.chat = function(){
    if($('#message-content').css('visibility')==='visible'){
      return;
    }

    var url = $location.absUrl().split("/");
    var id = url[url.length-1];
    $http({
      method: 'GET',
      url: '/api/user/' + $scope.my_id + '/chat/talkto/' + id
    }).then(function successCallback(response) {
        $scope.thischat = response.data.ret_data ;
        
        $rootScope.show_message = false;
        // $scope.thischat = '5a6aa2a68e5ea4d062f35aad';
        $('#message-content').css('visibility','visible');
        $('div[id=msg_list_view]').css('visibility','visible');
      
        $scope.message_page = 0;
        
        $http({
          method: 'GET',
          url: '/api/user/' + $scope.my_id + '/chat/' + $scope.thischat + '/messages/page/' + 0
        }).then(function successCallback(response) {
            $scope.chatting_list = response.data.ret_data ;
            // 等初始化完成之后滚动到底部
            var checkchattinglist = setInterval(function(){
              var list = $('div[id=chat_msg]');
              if(list.length===$scope.chatting_list.length){
                // var div = document.getElementById('msg_list_view');
                // div.scrollTop = div.scrollHeight;
                $('#msg_list_view').scrollTop($('#msg_list_view').prop('scrollHeight'));   
                        
                clearInterval(checkchattinglist);

                if(list.length===0){
                  $('#more_msg').css('visibility','hidden');
                }else{
                  $('#more_msg').css('visibility','visible');
                }

                socket.on('say', function(msg){
                  msg = JSON.parse(msg);
                  
                  var _msg = {
                    chat: msg.say.chat,
                    created_date: msg.say.dt,
                    msg: msg.say.msg,
                    user: msg.say.from
                  };
                  
                  if(_msg.chat===$scope.thischat){
                    $scope.announcement = $scope.announcement - 1;
                    $scope.chatting_list.unshift(_msg);
                    $scope.$apply();

                    // 等初始化完成之后滚动到底部
                    var checkchattinglist = setInterval(function(){
                      var list = $('div[id=chat_msg]');
                      if(list.length===$scope.chatting_list.length){
                        $('#msg_list_view').scrollTop($('#msg_list_view').prop('scrollHeight'));   
                        clearInterval(checkchattinglist);
                      }
                    },10);
                  }else{
                    console.log(msg)
                  }

                })

              }
            },10);

        }, function errorCallback(response) {
            // 请求失败执行代码
    });

    }, function errorCallback(response) {
        // 请求失败执行代码
    });





  }

  $scope.sendMsg = function(){
    if($scope.message===''){return;}
    var url = $location.absUrl().split("/");
    var id = url[url.length-1];
    var msg = {
      chat: $scope.thischat,
      from: $rootScope.my_id,
      from_name: $rootScope.my_name,
      to: id,
      msg: $scope.message
    }
    
    $rootScope.sendMessage(msg);
    $scope.message = '';
    $('#input_msg').focus();

    var _msg = {
          chat: msg.chat,
          created_date: getNowFormatDate(),
          msg: msg.msg,
          user: msg.from
        };
    $scope.chatting_list.unshift(_msg);
    
    // 等初始化完成之后滚动到底部
    var checkchattinglist = setInterval(function(){
      var list = $('div[id=chat_msg]')
      if(list.length===$scope.chatting_list.length){
        $('#msg_list_view').scrollTop($('#msg_list_view').prop('scrollHeight'));   
        clearInterval(checkchattinglist);
        
      }
    },10);
  }

  $scope.handleKey = function(e){
    var keycode = window.event ? e.keyCode : e.which;//获取按键编码

    if (e.ctrlKey && e.keyCode == 13) {
      $scope.sendMsg();
    }

    if (keycode == 13) { return;
      //$scope.sendMsg();
    }

  }

  $scope.getMoreMessages = function(chat){
    $scope.message_page = $scope.message_page + 1;
    var url = $location.absUrl().split("/");
    var id = url[url.length-1];
    $http({
      method: 'GET',
      url: '/api/user/' + $scope.my_id + '/chat/' + $scope.thischat + '/messages/page/' + $scope.message_page
    }).then(function successCallback(response) {
      
      $('div[id=msg_list_view]').css('visibility','hidden');

        var st_pos = $('#msg_list_view').prop('scrollHeight');

        var st_len = $scope.chatting_list.length;
        $scope.chatting_list = $scope.chatting_list.concat(response.data.ret_data) ;
        if(st_len===$scope.chatting_list.length){
          $('#more_msg').css('visibility','hidden');
        }
        
        // 等初始化完成之后滚动到原来位置
        var checkchattinglist = setInterval(function(){
          var list = $('div[id=chat_msg]');
          if(list.length===$scope.chatting_list.length){
            var h = $('#msg_list_view').prop('scrollHeight') - st_pos ;
            $('#msg_list_view').scrollTop(h);
            clearInterval(checkchattinglist);
            $('div[id=msg_list_view]').css('visibility','visible');
          }
        },10);
        
      

    }, function errorCallback(response) {
        // 请求失败执行代码
    });
  }


}); //controller




//jquery初始化
$(document).ready(function(){

  //滚动事件
  window.onscroll = function(e){
    var e =e || window.event;
    var scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
    
    // show_hide_navbar(scrolltop);

    //显示回到顶部按钮
    if (scrolltop>100){
      $("#backtotop").css("visibility","visible");
    }else{
      $("#backtotop").css("visibility","hidden");
    }

    
  };



});
//end jquery初始化





