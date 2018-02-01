
var homeApp = angular.module('homeApp', []);
homeApp.controller('homeData', function($scope) {
	$scope.picture_list = {
    title:'图片浏览',
    content:[
      { img:"/resource/1001",
      },
      { img:"/resource/1002",
      },
      { img:"/resource/1003",
      },
      { img:"/resource/1004",
      },
      { img:"/resource/1005",
      },
      { img:"/resource/1006",
      },
      { img:"/resource/1007",
      },
      { img:"/resource/1008",
      },
      { img:"/resource/1009",
      },
      { img:"/resource/1010",
      },
      { img:"/resource/2001",
      },
      { img:"/resource/2002",
      },
      { img:"/resource/2003",
      },
      { img:"/resource/2004",
      },
      { img:"/resource/2005",
      },
      { img:"/resource/2006",
      },
      { img:"/resource/2007",
      },
      { img:"/resource/2008",
      },
      { img:"/resource/2009",
      },
      { img:"/resource/2010",
      }
    ]
  };
  
});




$(document).ready(function(){
/*图片浏览*/
  

  //翻动图片时，缩略图高亮变化(通过触发img onclick事件，此处已经不再需要！)
  $('#picture_browse').on('slide.bs.carousel', function (event) {
        var $hoder = $('#picture_browse').find('.item'),
          $items = $(event.relatedTarget);
        //getIndex就是轮播到当前位置的索引
        var getIndex= $hoder.index($items);
        $('#picture_browse>.picture-thumb>.picture-list>img').each(function(i){
          if(i==getIndex){
            // $(this).attr("class","active");
          }else{
            // $(this).attr("class","");
          }
          
        })

      }) 

  //上一页按钮
  $('#picture_browse>div>.picture-control>.carousel-control.left>span').on('click',function(e){
    var current = parseInt($('#picture_browse>.picture-thumb>.picture-list>.active').attr("index"));
    if(current>0){
      var idx = current - 1;
      $($('#picture_browse>.picture-thumb>.picture-list>img')[idx]).trigger("click");
    }
    // $(this).parent().parent().carousel("prev");
  })

  //下一页按钮
  $('#picture_browse>div>.picture-control>.carousel-control.right>span').on('click',function(e){
    var current = parseInt($('#picture_browse>.picture-thumb>.picture-list>.active').attr("index"));
    if(current<$('#picture_browse>.picture-thumb>.picture-list>img').length-1){
      var idx = current + 1;
      $($('#picture_browse>.picture-thumb>.picture-list>img')[idx]).trigger("click");
    }
    // $(this).parent().parent().carousel("next");
  })

  //点击图片
  $('#picture_browse>.picture-thumb>.picture-list>img').on('click',function(e){
    var center_point = parseInt($(this).parent().css("width"))/2 - parseInt($(this).css("width"))/2;
    
    if($(this).attr("class")!="active"){
      
      $(this).parent().parent().parent().children(".carousel.slide").carousel(parseInt($(this).attr("index")));
      
      $(this).parent().children("img").attr("class","");
      $(this).attr("class","active");
      var picture_list = $(this).parent();
      var view_width = parseInt($(picture_list).css("width"));
      
      if(($(picture_list).children("img").length - parseInt($(this).attr("index")))>7 && parseInt($(this).attr("index"))>6){
        
        var ml = $(this).position().left - center_point + parseInt($(picture_list).attr("move_length"));
        $(picture_list).attr("move_length", ml);
        $(picture_list).animate({ scrollLeft: ml },600);
        $(picture_list).attr("stop",false);

      }else if(parseInt($(this).attr("index"))>6){ //后7张
        var obj = $(picture_list).children("img")[$(picture_list).children("img").length-4];
        var ml = $(obj).position().left - center_point + parseInt($(picture_list).attr("move_length"));
       
        if($(picture_list).attr("stop")=="false"){
          $(picture_list).attr("move_length", ml);
          $(picture_list).animate({ scrollLeft: ml },600);
          $(picture_list).attr("stop",true);
        }
      }else{ //前7张
        var ml = 0;
        $(picture_list).attr("move_length", ml);
        $(picture_list).animate({ scrollLeft: ml },600);
      }
    }
  
  })

  /*end 图片浏览*/

 
});

function show_pb(){
	$("#show1").css("height","100%");
	$("#show1").css("width","100%");
	$("#show1").css("visibility","visible");
	$(".html").css("overflow","hidden");
};

function close_pb(){
	$("#show1").css("height","0px");
	$("#show1").css("width","0px");
	$("#show1").css("visibility","hidden");
	$(".html").css("overflow","visibile");
};