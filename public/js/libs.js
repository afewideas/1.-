

var homeApp = angular.module('homeApp', []);

// html文本输出过滤器
angular.module('homeApp').filter('to_trusted', 
      ['$sce', function($sce){ 
        return function(text) { 
          return $sce.trustAsHtml(text); 
        }; 
      }]
      );

//
homeApp.controller('homeData', function($scope) {

  //初始化数据
  // $http({
  //   method: 'GET',
  //   url: ''
  // }).then(function successCallback(response) {
  //     //赋值
  //     $scope.slogan = response.data.slogan;
  //     $scope.search_options = response.data.search_options;
  // }, function errorCallback(response) {
  //     // 请求失败执行代码
  // });
  
  $scope.slide_title = {title:'好方法和好习惯'};
  $scope.slide_content = {
    size:8,
    content:[
      { show_pic:"/resources/new-1",
        description:"的三分大赛第三方第三方第三方第三方第三方撒打发第三方",
        owner_pic:"/resources/new-1",
        owner_name:"老张",
        like_num:120,
        comment_num:9,
        label:"标签",
        url:'/page/0'
      },
      { show_pic:"/resources/new-2",
        description:"的三分大赛第三方第三方第三",
        owner_pic:"/resources/new-2",
        owner_name:"票品牌",
        like_num:120,
        comment_num:9,
        label:"高新",
        url:'/page/1'
      },
      { show_pic:"/resources/new-3",
        description:"的三分大赛第三方第三方第三方第三方第三方撒打发第三方",
        owner_pic:"/resources/new-3",
        owner_name:"我还哦啊而已",
        like_num:120,
        comment_num:9,
        label:"",
        url:'/page/2'
      },
      { show_pic:"/resources/new-4",
        description:"的三分大赛第三方第三方第三方第三方第三方撒打发第三方",
        owner_pic:"/resources/new-4",
        owner_name:"完犊子",
        like_num:120,
        comment_num:9,
        label:"成功",
        url:'/page/3'
      },
      { show_pic:"/resources/new-5",
        description:"的三分大赛第三方第三方第三方第三方第三方撒打发第三方",
        owner_pic:"/resources/new-5",
        owner_name:"偏差三分",
        like_num:120,
        comment_num:9,
        label:"",
        url:'/page/4'
      },
      { show_pic:"/resources/new-6",
        description:"的三分大赛第三方第三方第三方第三方第三方分法第三",
        owner_pic:"/resources/new-6",
        owner_name:"地方方法",
        like_num:120,
        comment_num:9,
        label:"继续",
        url:'/page/5'
      },
      { show_pic:"/resources/new-7",
        description:"的三分大赛第三方第三方第三方第三方第三方撒打发第三方撒打发第三方，第三方的范德萨撒旦撒多，三",
        owner_pic:"/resources/new-7",
        owner_name:"Peter",
        like_num:120,
        comment_num:9,
        label:"上课",
        url:'/page/6'
      },
      { show_pic:"/resources/new-8",
        description:"的三分大赛第三方第三方第三方第三方第三方撒打发第三方",
        owner_pic:"/resources/new-8",
        owner_name:"James",
        like_num:120,
        comment_num:9,
        label:"",
        url:'/page/7'
      }
    ]
  };

  // 设置4页图片轮播总次数（全局变量）
  slide_totle = $scope.slide_content.size;
  slide_cnt = slide_totle - 3;
  // end 初始化数据


 

  // 页面跳转，打开新窗口
  $scope.gotoPage = function(url){
    // window.location=url;
    window.open(url);
  }

});



//jquery初始化
$(document).ready(function(){

  // 绑定手势
  //手势右滑
  $('#xsCarousel').bind('swiperight swiperightup swiperightdown',function(){
    $("#xsCarousel").carousel('prev');
  })
  //手势左滑
  $('#xsCarousel').bind('swipeleft swipeleftup swipeleftdown',function(){
    $("#xsCarousel").carousel('next');
  })


});



// 轮播功能
// 4页图片轮播按钮状态切换
function check_slide_pos(pos){
  slide_cnt = slide_cnt + pos;
  if (slide_cnt==5){
    $(".next-slide").css("visibility","visible");
    $(".prev-slide").css("visibility","hidden");
  }else if (slide_cnt==1) {
    $(".next-slide").css("visibility","hidden");
    $(".prev-slide").css("visibility","visible");
  }else{
    $(".next-slide").css("visibility","visible");
    $(".prev-slide").css("visibility","visible");
  }
}

$(function(){
// 循环轮播到上一个项目
    $(".prev-slide").click(function(){
      $("#myCarousel").carousel('prev');
      $("#myCarousel_1").carousel('prev');
      $("#myCarousel_2").carousel('prev');
      $("#myCarousel_3").carousel('prev');
      check_slide_pos(1);
    });
    // 循环轮播到下一个项目
    $(".next-slide").click(function(){
      $("#myCarousel").carousel('next');
      $("#myCarousel_1").carousel('next');
      $("#myCarousel_2").carousel('next');
      $("#myCarousel_3").carousel('next');
      check_slide_pos(-1);
    });
});

// end 轮播功能


