



//控制器
frameApp.controller('article_editor', function($scope,$http,$location,$rootScope) {

  var ue = UE.getEditor('editor');

    //初始化数据
  $scope.initData = function(){

    var timer;
    var domUtils = UE.dom.domUtils;
    var count = 0; //字数

    ue.addListener('ready',function(){  //编辑器初始化完成后
      
      //初始化字数
      count = ue.getContentLength(true);

      //监听keyup事件，统计字数，自动保存
      domUtils.on(ue.body,"keyup",function(){

        clearTimeout(timer);
       
        timer = setTimeout(function(){
        
          if(count!=ue.getContentLength(true)){
            $scope.saved = "保存中...";
            count = ue.getContentLength(true);
            
            $scope.save();
            
          }
        
        },500); //每隔1秒
        
      })

      var url = $location.absUrl().split("/");

      if(url[url.length-1]=="write"){ //新建

        $scope.newArticle();

      }else if(url[url.length-1]=="modify"){  //修改
        $http({
          method: 'GET',
          url: '/api/article/' + url[url.length-2] 
        }).then(function successCallback(response) {
            $scope.article = response.data;

            //初始化编辑器内容
            if(typeof($scope.article.content)=="undefined"){
              $scope.article.content = "";
            }
            ue.setContent($scope.article.content);
            
            $scope.getUserArticles();

         }, function errorCallback(response) {
            // 请求失败执行代码
        });
      
      }

    });

  }
  // end 初始化数据
 
  $scope.getUserArticles = function(){
    $http({
      method: 'GET',
      url: '/api/user/' + $rootScope.my_id + '/articles' ,
    }).then(function successCallback(response) {
      $scope.user_articles = response.data.ret_data;
    }, function errorCallback(response) {
        // 请求失败执行代码
        
    });

  }

  $scope.save = function(){
    var d = new Date();
    var h = d.getHours().toString();
    if(h.length==1){
      h = '0'+h;
    }
    var m = d.getMinutes().toString();
    if(m.length==1){
      m = '0'+m;
    }
    var s = d.getSeconds().toString();
    if(s.length==1){
      s = '0'+s;
    }
    var t = h + ':' + m + ':' + s ;

    $scope.article.content = ue.getContent();

    if(typeof($scope.article._id) == "undefined"){
    
      $http({
        method: 'POST',
        url: '/api/article/add' ,
        data: {article:$scope.article}
      }).then(function successCallback(response) {
          if(response.data.ret_code==0){
            $scope.saved = "已保存";
            $scope.saved_time = t ;
            $scope.article = response.data.ret_data;
            $scope.getUserArticles();
            
          }else{
            $scope.saved = "";
            $scope.saved_time = "";
          }
      }, function errorCallback(response) {
          // 请求失败执行代码
          $scope.saved = "保存失败";
          $scope.saved_time = t;
      });

    }else{
     
      $http({
        method: 'PUT',
        url: '/api/article/' + $scope.article._id ,
        data: {article:$scope.article}
      }).then(function successCallback(response) {
          if(response.data.ret_code==0){
            $scope.saved = "已保存";
            $scope.saved_time = t ;
            $scope.getUserArticles();
          }else{
            $scope.saved = "";
            $scope.saved_time = "";
          }
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    }

  }


  $scope.loadArticle = function(aid){
    $http({
      method: 'GET',
      url: '/api/article/' + aid ,
    }).then(function successCallback(response) {
      $scope.article = response.data;
      if(typeof($scope.article.content)=="undefined"){
        $scope.article.content = "";
      }
      ue.setContent($scope.article.content);
      
      

    }, function errorCallback(response) {
        // 请求失败执行代码
        
    });

  }

  $scope.newArticle = function(){
    var date = new Date();
    var h = date.getHours().toString();
    if(h.length==1){
      h = '0' + h ;
    }
    var m = date.getMinutes().toString();
    if(m.length==1){
      m = '0' + m ;
    }
    var newtitle = date.toLocaleDateString().replace(/\//g,'-') + ' ' + h + ':' + m ;
    $scope.article = {title:newtitle};
    ue.setContent("");
    $scope.save();

  }


}); //controller




//jquery初始化
$(document).ready(function(){



});
//end jquery初始化

