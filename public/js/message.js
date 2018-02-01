



//控制器
frameApp.controller('message', function($scope,$http,$location,loadingInterceptor,$rootScope) {
  
  

  //初始化数据
  $scope.initData = function(){

    $rootScope.show_message = false;
    

    if (typeof(initData) == "undefined"){
      $scope.getChatItems()
    }else{
      $scope.user = initData;
      
    }

    socket.on('say', function(msg){
        msg = JSON.parse(msg);
        
        var _msg = {
          chat: msg.say.chat,
          created_date: msg.say.dt,
          msg: msg.say.msg,
          user: msg.say.from
        };
        
        if($scope.chatting_user){
          if(_msg['chat']===$scope.chatting_user.chat){
            $scope.chatting_list.unshift(_msg);
            $scope.$apply();

            // 等初始化完成之后滚动到底部
            var checkchattinglist = setInterval(function(){
              var list = $('div[id=chat_msg]');
              if(list.length===$scope.chatting_list.length){
                var h = $(document).height()-$(window).height() ;
                $(document).scrollTop(h);
                clearInterval(checkchattinglist);
              }
            },10);
          }else{
            $scope.chat_list.forEach(function(val){
              if(val.chat===_msg['chat']){
                val.unread = val.unread + 1;
                val.last_msg = _msg;
              } 
            });
            $scope.chat_unread = $scope.chat_unread + 1;
            $scope.$apply();
          }
        }else{
          $scope.chat_list.forEach(function(val){
            if(val.chat===_msg['chat']){
              val.unread = val.unread + 1;
              val.last_msg = _msg;
            } 
          });
          console.log($scope.chat_unread)
          $scope.chat_unread = $scope.chat_unread + 1;
          $scope.$apply();
        }
        

      })


  }
  // end 初始化数据


  $scope.getChatItems = function(){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];
      
      $http({
        method: 'GET',
        url: '/api/user/' + id + '/chats'
      }).then(function successCallback(response) {
          $scope.chat_list = response.data.ret_data;
          $scope.chat_unread = 0;
          $scope.chat_list.forEach(function(val){
            $scope.chat_unread = $scope.chat_unread + val.unread ;
          })
          if($scope.chat_unread>99){
            $scope.chat_unread = '···'; //垂直居中，不是句号
          }
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
  }

  $scope.loadSettings = function(uid,n){
    
    if($('#message-item-'+n).hasClass('selected')){return;}

    $('[id^=message-item]').removeClass('selected');
    $('#message-item-'+n).addClass('selected');

    $('[id^=message-content]').removeClass('selected');
    $('#message-content-'+n).addClass('selected');

  }
 
  $scope.chat = function(chat_item){
    $scope.nomore=false;
    $scope.message_page = 0;
    var url = $location.absUrl().split("/");
    var id = url[url.length-1];
    $http({
      method: 'GET',
      url: '/api/user/' + id + '/chat/' + chat_item.chat + '/messages/page/' + $scope.message_page
    }).then(function successCallback(response) {

        
        $scope.chatting_list = response.data.ret_data ;
        // 等初始化完成之后滚动到底部
        var checkchattinglist = setInterval(function(){
          var list = $('div[id=chat_msg]');
          if(list.length===$scope.chatting_list.length){
            var h = $(document).height()-$(window).height() ;
            $(document).scrollTop(h);
            clearInterval(checkchattinglist);
            $('div[id=msg_list_view]').css('visibility','visible');

          }
        },10);
        
        //未读数
        $scope.chat_unread = $scope.chat_unread - chat_item.unread;
        chat_item.unread = 0;

    }, function errorCallback(response) {
        // 请求失败执行代码
    });

    $scope.chatting_user = chat_item;

    // console.log(chat_item)
    // socket.on('say', function(msg){
    //     msg = JSON.parse(msg);
        
    //     var _msg = {
    //       chat: msg.say.chat,
    //       created_date: msg.say.dt,
    //       msg: msg.say.msg,
    //       user: msg.say.from
    //     };
        
    //     console.log(_msg.chat+'==='+$scope.chatting_user.chat)
    //     if(_msg.chat===$scope.chatting_user.chat){
    //       $scope.chatting_list.unshift(_msg);
    //       $scope.$apply();

    //       // 等初始化完成之后滚动到底部
    //       var checkchattinglist = setInterval(function(){
    //         var list = $($('#message-content-1').children()[0]).children();
    //         if(list.length===$scope.chatting_list.length+4){
    //           var h = $(document).height()-$(window).height() ;
    //           $(document).scrollTop(h);
    //           clearInterval(checkchattinglist);
    //         }
    //       },10);
    //     }else{
    //       console.log(msg)
    //     }

    //   })

    $scope.chatting = true;

  }

  $scope.chatlist = function(chat){
   
    var url = $location.absUrl().split("/");
    var id = url[url.length-1];
    $http({
      method: 'PUT',
      url: '/api/user/' + id + '/chat/' + chat + '/close'
    }).then(function successCallback(response) {
        // console.log(response.data.ret_data) ;
        
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
    $scope.getChatItems()
    $scope.chatting_user = null;
    $scope.chatting = false;
   
  }

  $scope.sendMsg = function(){
    if($scope.message===''){return;}
    
    var msg = {
      chat: $scope.chatting_user.chat,
      from: $rootScope.my_id,
      from_name: $rootScope.my_name,
      to: $scope.chatting_user.talk_user,
      msg: $scope.message
    }
    
    $rootScope.sendMessage(msg);
    $scope.message = '';
    $('#input_msg').css('height','40px');
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
        var h = $(document).height()-$(window).height() ;
        $(document).scrollTop(h);
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
      url: '/api/user/' + id + '/chat/' + chat + '/messages/page/' + $scope.message_page
    }).then(function successCallback(response) {
      
      $('div[id=msg_list_view]').css('visibility','hidden');

        var st_pos = $(document).height();
        var st_len = $scope.chatting_list.length;
        $scope.chatting_list = $scope.chatting_list.concat(response.data.ret_data) ;
        if(st_len===$scope.chatting_list.length){
          $scope.nomore=true;
        }
        
        // 等初始化完成之后滚动到原来位置
        var checkchattinglist = setInterval(function(){
          var list = $('div[id=chat_msg]');
          if(list.length===$scope.chatting_list.length){
            // console.log($(document).height()+'--'+st_pos)
            var h = $(document).height()-st_pos ;
            $(document).scrollTop(h);
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


});
//end jquery初始化


function autoTextAreaHeight(o) {  
  console.log(o.style.height)
  o.style.height = o.scrollTop + o.scrollHeight + "px";  
}

function makeExpandingArea(el) {

    var setStyle = function(el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
        // console.log(el.scrollHeight);
    }
    var delayedResize = function(el) {
        window.setTimeout(function() {
            setStyle(el)
        },
        0);
    }
    if (el.addEventListener) {
        el.addEventListener('input',function() {
            setStyle(el)
        },false);
        setStyle(el)
    } else if (el.attachEvent) {
        el.attachEvent('onpropertychange',function() {
            setStyle(el)
        });
        setStyle(el)
    }
    if (window.VBArray && window.addEventListener) { //IE9
        el.attachEvent("onkeydown",function() {
            var key = window.event.keyCode;
            if (key == 8 || key == 46 ) delayedResize(el);

        });
        el.attachEvent("oncut",function() {
            delayedResize(el);
        }); //处理粘贴
    }
}

/**
 * 文本框根据输入内容自适应高度
 * @param                {HTMLElement}        输入框元素
 * @param                {Number}                设置光标与输入框保持的距离(默认0)
 * @param                {Number}                设置最大高度(可选)
 */
var autoTextarea = function (elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                        elem.addEventListener ?
                                elem.addEventListener(type, callback, false) :
                                elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                        var val = elem.currentStyle[name];
 
                        if (name === 'height' && val.search(/px/i) !== 1) {
                                var rect = elem.getBoundingClientRect();
                                return rect.bottom - rect.top -
                                        parseFloat(getStyle('paddingTop')) -
                                        parseFloat(getStyle('paddingBottom')) + 'px';        
                        };
 
                        return val;
                } : function (name) {
                                return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));
 
        elem.style.resize = 'none';
 
        var change = function () {
                var scrollTop, height,
                        padding = 0,
                        style = elem.style;
 
                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;
 
                if (!isFirefox && !isOpera) {
                        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
 
                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                        if (maxHeight && elem.scrollHeight > maxHeight) {
                                height = maxHeight - padding;
                                style.overflowY = 'auto';
                        } else {
                                height = elem.scrollHeight - padding;
                                style.overflowY = 'hidden';
                        };
                        style.height = height + extra + 'px';
                        scrollTop += parseInt(style.height) - elem.currHeight;

                        //不滚屏，避免聊天信息位置显示错乱！！！！！
                        //document.body.scrollTop = scrollTop;
                        //document.documentElement.scrollTop = scrollTop;

                        elem.currHeight = parseInt(style.height);
                };
        };
 
        var changeForBlur = function () {
          if($(elem).val().trim().length===0){
            $(elem).css('height','40px');
          }
        }

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        addEvent('blur', changeForBlur);
        change();
};

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

// function getFormatDate(date) {
//     var seperator1 = "-";
//     var seperator2 = ":";
//     var month = date.getMonth() + 1;
//     var strDate = date.getDate();
//     if (month >= 1 && month <= 9) {
//         month = "0" + month;
//     }
//     if (strDate >= 0 && strDate <= 9) {
//         strDate = "0" + strDate;
//     }
//     var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
//             + " " + date.getHours() + seperator2 + date.getMinutes()
//             + seperator2 + date.getSeconds();
//     return currentdate;
// } 