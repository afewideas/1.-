


//
frameApp.controller('explore', function($scope,$http) {

  //初始化数据
  
  $http({
    method: 'GET',
    url: '/api/recipe/recommend'
  }).then(function successCallback(response) {
      $scope.recipe_recommend = response.data;
  }, function errorCallback(response) {
      // 请求失败执行代码
  });

  
  
  //文章精选
  $http({
    method: 'GET',
    url: '/api/article/hot'
  }).then(function successCallback(response) {
      $scope.article_hot = response.data;
  }, function errorCallback(response) {
      // 请求失败执行代码
  });
  
  
  // end 初始化数据


  // 搜索功能
  // 搜索自动完成列表
  $scope.getMatchedKeywords = function(pos){
    input_str = switch_search_dropdown(pos);
    if(input_str!=''){
      $http({
        method: 'GET',
        url: '/search/keywords/' + input_str 
      }).then(function successCallback(response) {
          $scope.keywords_matched = response.data;
      }, function errorCallback(response) {
          // 请求失败执行代码
      });
    }else{
      $scope.keywords_matched = [];
    }
    
  };

  $scope.inputKeyup = function(pos){
    $scope.getMatchedKeywords(pos);
    
  };

  $scope.inputFocus = function(pos){
    $scope.getMatchedKeywords(pos);
  };
  // end 搜索功能


  // 页面跳转，打开新窗口
  $scope.gotoPage = function(url){
    // window.location=url;
    window.open(url);
  }

}); //homeApp controller


// 搜索功能
// 根据input_keywords中的内容切换下拉区域的内容
function switch_search_dropdown(pos){

  input_str = $('#input_keywords').val();
  
  if(input_str==''){//没有内容
    if(pos==0){//大屏时，显示条件选项
      $('#search_options').css('visibility','visible');
      $('#search_options').css('height','');
      $('#search_keywords').css('visibility','hidden');
      $('#search_keywords').css('height','0px');
    }else if(pos==1){//小屏时，隐藏下拉区域
      $('#menu_list_1').css('visibility','hidden');
    };
  }else{//已经输入了内容
    if(pos==0){//大屏时，显示自动完成列表
      $('#search_options').css('visibility','hidden');
      $('#search_options').css('height','0px');
      $('#search_keywords').css('visibility','visible');
      $('#search_keywords').css('height',''); 
    }else if(pos==1){//小屏时，显示下拉区域
      $('#menu_list_1').css('visibility','visible');
    };
  };
  return input_str;

};

// 选中自动完成列表，向搜索输入框赋值
function put_input_val(obj){
  // 有多个id为input_keywords的input对象，全部赋值
  $('input[id=input_keywords]').each(function(i){
    $(this).val(obj);
  }); 
}

// end 搜索功能


//jquery初始化
$(document).ready(function(){

  //带三角弹出框菜单初始化
  //$(function () {
    //$('[data-toggle="popover"]').popover()
  //})


  // 选中查询条件，向所有的id为input_keywords的input对象赋值
  //自定义skey标签，按标签统一设置事件，方便！！
  $('skey').on('click',function(e){
    get_val = $(this).text();
    $('input[id=input_keywords]').each(function(i){
      $(this).val(get_val);
    }) 

  });

  /*
  //绑定'input propertychange'事件，手机浏览器可以响应此事件
  $('input').bind('input propertychange', function() { 
  　　
});*/



 
});
//end jquery初始化

//$('skey').on('click', 在iPhone上不能触发，cursor:pointer也不行！！
function skey_iphone(obj){
  get_val = $(obj).text();
  $('input[id=input_keywords]').each(function(i){
    $(this).val(get_val);
  }) 
}

/*单行横向滑动*/

function slide_row_scrollToRight(obj) {

  var slide_row_container = $(obj).parent();
  var slide_row_swiper = $(slide_row_container).children(".slide-row-swiper");
  var slide_block = $(slide_row_swiper).children(".slide-block");
  var slide_scroll = parseInt($(slide_row_swiper).attr("slide-scroll"));

  var totle_len = (parseInt($(slide_block).css("width")) + 20) * $(obj).attr("size") - 20; //去掉最后一个margin值20px！！

  var hidden_len = totle_len - parseInt($(slide_row_swiper).css("width")) ;

  //步长累加
  slide_scroll = slide_scroll + ( parseInt($(slide_block).css("width")) + 20 );
  
  $(slide_row_swiper).animate({ scrollLeft:slide_scroll},600);
  $(slide_row_swiper).attr("slide-scroll",slide_scroll);

  if ( ( hidden_len - slide_scroll ) < 1 ) {  //隐藏宽度归零
    $(slide_row_container).children(".slide-row-button-right").css("visibility","hidden");
    $(slide_row_container).children(".slide-row-button-left").css("visibility","visible");
  }else{
    $(slide_row_container).children(".slide-row-button-right").css("visibility","visible");
    $(slide_row_container).children(".slide-row-button-left").css("visibility","visible");
  }

}

function slide_row_scrollToLeft(obj) {

  var slide_row_container = $(obj).parent();
  var slide_row_swiper = $(slide_row_container).children(".slide-row-swiper");
  var slide_block = $(slide_row_swiper).children(".slide-block");
  var slide_scroll = parseInt($(slide_row_swiper).attr("slide-scroll"));
  
  //步长递减
  slide_scroll = slide_scroll - (parseInt($(slide_block).css("width")) + 20);
  
  $(slide_row_swiper).animate({ scrollLeft:slide_scroll},600);
  $(slide_row_swiper).attr("slide-scroll",slide_scroll);

  if (slide_scroll <= 0) { //步长归零
    $(slide_row_container).children(".slide-row-button-right").css("visibility","visible");
    $(slide_row_container).children(".slide-row-button-left").css("visibility","hidden");
  }else{
    $(slide_row_container).children(".slide-row-button-right").css("visibility","visible");
    $(slide_row_container).children(".slide-row-button-left").css("visibility","visible");
  }
  
}

// 根据图片高度，调整label和button的高度
function fix_label(obj){
  var h =parseInt($(obj).css("height")) - 245 ;
  var label = $(obj).parent().children(".slide-label").children("div");
  var top = parseInt($(label).css("top"));
  $(label).css("top",top + h) ;
  
  if($(obj).parent().parent().attr("button_fixed")=="false"){ 
    var button = $(obj).parent().parent().parent().children(".slide-row-button");
    var bt = parseInt($(button).css("top")) ;
    $(button).css("top",bt + h/2 ) ;
    $(obj).parent().parent().attr("button_fixed",true);
  }
}
/*end 单行横向滑动*/


