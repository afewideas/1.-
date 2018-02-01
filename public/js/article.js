



//控制器
frameApp.controller('article', function($scope,$http,$location,$compile,$rootScope) {

  
  //初始化数据
  $scope.initData = function(){
    if (typeof(initData) == "undefined"){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];
      //获取文章
      $http({
        method: 'GET',
        url: '/api/article/' + id
      }).then(function successCallback(response) {
          $scope.article = response.data;
          $scope.favorite = $scope.article.favorite; 
          $scope.comment = $scope.article.comment; 
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    }else{
      $scope.article = initData;
      $scope.favorite = $scope.article.favorite; 
      $scope.comment = $scope.article.comment; 
    }
  }
  // end 初始化数据

  
  //按页码获取评论
  $scope.getComment = function(page){

    //获取当前页码
    var current = parseInt($("#comment_page").children(".active").text()) - 1;
    if(page==-1){//上一页
      if(current>0){
        page = current - 1 ;
      }else{
        page = 0;
      }
    }else if(page==-2){//下一页
      if(current<$("#comment_page").attr("size")-1){
        page = current + 1;
      }else{
        page = $("#comment_page").attr("size")-1 ;
      }
      
    }

    var url = $location.absUrl().split("/");
    var id = url[url.length-1];

    //获取评论
    $http({
      method: 'GET',
      url: '/api/article/' + id + "/comments/" + page
    }).then(function successCallback(response) {
        $scope.comment_page = response.data;
        $scope.comment = $scope.comment_page.comment_count;
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
  };
  
  //张贴评论
  $scope.postComment = function(){
    // var content = $("#post_comment").val();
    var content = $scope.postcomment ; //使用ng-model值方便同步控制ng-if的状态
    if(content!=null && content!=""){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];

      $http({
        method: 'POST',
        url: '/api/article/' + id + "/comment",
        data: {content:content}
      }).then(function successCallback(response) {
          if(response.data.ret_code==0){
            //重新加载评论 若减少流量，只处理页面即可.........
            $scope.getComment(0);
            // $("#post_comment").val("");
            $scope.postcomment = null; //使用ng-model值方便同步控制ng-if的状态
          }
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    } 

  };

  //显示回复区
  $scope.replycomment = [];
  $scope.showReplyBlock = function(index,cid){
    var obj = $("#r_"+index);
    if(!obj.hasClass("reply-show")){

      //此处引号较多，确保正确!!!!!!!
      var reply_block = '\
        <div class="row-fluid comment-reply">\
          <form role="form">\
            <div class="form-group">\
              <textarea id="reply_comment_'+index+'" ng-model="replycomment['+index+']" class="form-control " placeholder="写下你的回复..." rows="3"></textarea>\
            </div>\
          </form>\
          <div class="pull-right reply-btn " ng-class="{\'disabled-reply-btn\':replycomment['+index+']==null||replycomment['+index+']==\'\'}" ng-click="replyComment('+index+',\''+cid+'\')">发送</div>\
          <div class="pull-right reply-btn" style="background-color:#CCC;color:#777;" ng-click="hideReplyBlock($event,'+index+')">取消</div>\
        </div>';
      var $reply_block = $compile(reply_block)($scope);     
      obj.append($reply_block);
      obj.addClass("reply-show");

      //输入框的顶部 + 输入框高度  == 当前页面顶部位置 + 窗口可视高度 == 页面在可视窗口的底部位置
      var hiddenHeight = ( $reply_block.offset().top + $reply_block.outerHeight(true) - $(window).height() ) - $(window).scrollTop() ;
      if (hiddenHeight>0){
        var movelength = $(window).scrollTop() + hiddenHeight ;
        $("html,body").animate({scrollTop:movelength},300);
      }

      $('#reply_comment_'+index).focus();
    }
  };

  //隐藏回复区
  $scope.hideReplyBlock = function($event,index){
    var obj = $($event.target).parent();
    obj.parent().removeClass("reply-show");
    obj.remove();
    $scope.replycomment[index] = null;
  };

  //回复评论
  $scope.replyComment = function(index,cid){
    var content = $("#reply_comment_"+index).val();
    if(content!=null && content!=""){
      var url = $location.absUrl().split("/");
      var id = url[url.length-1];

      $http({
        method: 'PUT',
        url: '/api/article/' + id + '/comment/' + cid + '/reply',
        data: {content:content}
      }).then(function successCallback(response) {
          if(response.data.ret_code==0){
            //重新加载评论 若减少流量，只处理页面即可.........
            $scope.getComment(0);
            $scope.replycomment[index] = null;
          }
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    }

  };
  
  //评论点赞
  $scope.thumbsupComment = function(cid){
    
    var url = $location.absUrl().split("/");
    var id = url[url.length-1];

    $http({
      method: 'PUT',
      url: '/api/article/' + id + "/comment/" + cid + "/thumbsup",
      data: {}
    }).then(function successCallback(response) {
      $("#cid_"+cid).text(response.data.ret_data.thumbs_up);
      if (response.data.ret_data.my_thumbs_up==0){
        $("#cid_"+cid).parent().removeClass("selected");
      }else{
        $("#cid_"+cid).parent().addClass("selected");
      }
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
  };

  

  //收藏文章
  $scope.favArticle = function(article){
    var url = $location.absUrl().split("/");
    var id = url[url.length-1];
    $http({
      method: 'PUT',
      url: '/api/article/' + id + "/favorite",
      data: {}
    }).then(function successCallback(response) {
      article.my_favorite = response.data.ret_data;
      if(article.my_favorite==1){
        $scope.favorite = $scope.favorite + 1 ;
      }else{
        $scope.favorite = $scope.favorite - 1 ;
      }
      
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
  };

  //监控登录状态
  $scope.$watch('logged_in',  function(newValue, oldValue) {

    if (newValue === oldValue) { return; } 
     
    $scope.initData();

    if($("#comment").attr("loaded")=="true"){
      var page = 0;
      if(!isNaN(parseInt($("#comment_page").children(".active").text()))){
        page = parseInt($("#comment_page").children(".active").text()) - 1;
      }
      $scope.getComment(page);
    }
    

  });


}); //articleApp controller




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

    //滚动到评论区，加载第0页评论内容
    var comment_pos = $("#comment").offset().top - scrolltop - $(window).height();
    if(comment_pos<0 &&  $("#comment").attr("loaded")=="false"){

      var appElement = document.querySelector('[ng-controller=article]');
      var $scope = angular.element(appElement).scope(); 
      $scope.getComment(0);
      $scope.$apply();

      $("#comment").attr("loaded","true");  
    }

    
    
  };

  //分享事件(无效,可以删除)
  $("body").on('click',"#my_share",function(e){
    
    if($(this).attr("show")==0){
      var opt = {
        title: "打开微信“扫一扫”<br>打开网页后点击屏幕<br>右上角分享按钮",
        container: "body",
        placement: "left",
        html: true,
        toggle:"popover",
        content: '<div id="my_share_qrcode"></div>',
        trigger: "click"
      }
      $(this).popover(opt);
      $(this).popover("show");

      var container = document.getElementById("my_share_qrcode");
      var qrcode = new QRCode(
        container, {
        width: 128,
        height: 128,
        // colorDark : "#000000",
        // colorLight : "#ffffff",
      });
      qrcode.clear();
      qrcode.makeCode(location.href);
      $(this).attr("show",1);
    }else{
      $(this).attr("show",0);
      $(this).popover('destroy');
    }
    
    
  });

  
  
  
  //分享事件
  $("body").on('click',"#sharearticle",function(e){

    if($("#sharearticle_qrcode_canvas").css("visibility")=="visible"){
      $("#sharearticle_qrcode_canvas").css("visibility","hidden");
    
    }else{
      var container = document.getElementById("sharearticle_qrcode");

      $(container).html(""); //清空上次已经生成的图像

      var qrcode = new QRCode(
        container, {
        width: 128,
        height: 128,
        // colorDark : "#000000",
        // colorLight : "#ffffff",
      });
      qrcode.clear();
      qrcode.makeCode(location.href);
      
      $("#sharearticle_qrcode_canvas").css("visibility","visible");
    }
  });



});
//end jquery初始化




//显示、隐藏更多回复
var article_show_hide_reply = function(obj){
  var reply_list = $(obj).parent().parent().children("#comment_reply");

  $(reply_list).each(function(i){
    if(i>=3){
      if($(this).hasClass("ng-hide")){
        $(this).removeClass("ng-hide");
        $(obj).text("收起");
      }else{
        $(this).addClass("ng-hide");
        $(obj).text("查看更多");
      }
    }
  }); 
}

