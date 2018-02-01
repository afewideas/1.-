
var host = "http://192.168.1.21:8081/";

var carApp = angular.module('carApp', [])

//假数据
carApp.controller('car_data', function($scope) {

  $scope.cars = [
    {id:201701,name:"BMW",price:190,speed:"210km/h",color:"白色"},
    {id:201702,name:"BYD",price:25,speed:"160km/h",color:"红色"},
    {id:201703,name:"Benz",price:300,speed:"215km/h",color:"蓝色"},
    {id:201704,name:"Honda",price:190,speed:"170km/h",color:"黑色"},
    {id:201705,name:"QQ",price:130,speed:"210km/h",color:"白色"}
  ];

});

//调用webapi的GET接口
carApp.controller('car_list', function($scope,$http) {

    $http({
      method: 'GET',
      url: host+'cars'
    }).then(function successCallback(response) {
      //向cars赋值json格式
      $scope.cars = response.data;
    }, function errorCallback(response) {
      // 请求失败执行代码
    });

});




//实现所有的api调用
carApp.controller('car_get', function($scope,$http, $location) {

  $scope.initData = function(){

    //网页打开默认加载所有数据
    $scope.car_list = false;
    $scope.rs = !$scope.car_list;
    $scope.car_edit = true;

    $http({
      method: 'GET',
      url: host+'cars'
    }).then(function successCallback(response) {
      //向cars赋值json格式
      $scope.cars = response.data;
    }, function errorCallback(response) {
      // 请求失败执行代码
    });
  }

  //响应查询按钮
  $scope.search = function(){ 
     
    if($scope.s_car_id!=undefined && $scope.s_car_id!=''){

      var getid =  $http({
            method: 'GET',
            url: host+'cars/'+$scope.s_car_id
        });

      getid.then(function (response) {

            $scope.car = response.data; //查询结果赋值json格式
            if($scope.car==''){
              $scope.del = true;
            }else{
              $scope.del = false;
            }

        }, function (response) {
            //alert(response);
        });

      //显示结果区，隐藏全部列表数据
      $scope.car_list = true;
      $scope.rs = false;

    }else{

      var get_all =  $http({
        method: 'GET',
        url: host+'cars/'
        });
      
      get_all.then(function (response) {
      
        $scope.cars = response.data; //刷新数据列表
      
      }, function (response) {
        //alert(response);
      });


      $scope.car_list = false;
      $scope.rs = true;
    };
    

  }; 

  //响应行点击事件
  $scope.loadCar = function(car){
    $scope.car_id = car.id;
    $scope.car_name = car.name;
    $scope.car_speed = car.speed;
    $scope.car_color = car.color;
    $scope.car_price = car.price;
  }


  //响应添加按钮
  $scope.add = function(){
    var addCar =  $http({
        method: 'POST',
        url: host+'cars/car',
        data: {id:$scope.car_id,name:$scope.car_name,price:$scope.car_price,speed:$scope.car_speed,color:$scope.car_color}
        });

    addCar.then(function (response) {
            //console.log(response.data); 
        }, function (response) {
            //;
        });


      //只要给表格上的数据赋值，即可刷新！！！
      var get_all =  $http({
        method: 'GET',
        url: host+'cars/'
        });
      
      get_all.then(function (response) {
      
        $scope.cars = response.data; //刷新数据列表
      
      }, function (response) {
        //alert(response);
      });

      $scope.car_data_list = false;
      $scope.car_edit = true;

  }

  //响应显示修改
  $scope.showEdit = function(car){
      $scope.car_edit = false;
      $scope.car_data_list = true;

  }

  //响应修改按钮
  $scope.update = function(){
    var updateCar =  $http({
        method: 'PUT',
        url: host+'cars/car',
        data: {id:$scope.car_id,name:$scope.car_name,price:$scope.car_price,speed:$scope.car_speed,color:$scope.car_color}
        });

    updateCar.then(function (response) {
            //console.log(response.data); 
        }, function (response) {
            //;
        });


      //只要给表格上的数据赋值，即可刷新！！！
      var get_all =  $http({
        method: 'GET',
        url: host+'cars/'
        });
      
      get_all.then(function (response) {
      
        $scope.cars = response.data; //刷新数据列表
      
      }, function (response) {
        //alert(response);
      });

      $scope.car_data_list = false;                                                                                                                        
      $scope.car_edit = true;


  }


  //响应删除按钮
  $scope.delete = function(){
    var deleteCar =  $http({
        method: 'DELETE',
        url: host+'cars/id/'+$scope.car_id,
        });

    deleteCar.then(function (response) {
            //console.log(response.data); 
        }, function (response) {
            //;
        });


      //只要给表格上的数据赋值，即可刷新！！！
      var get_all =  $http({
        method: 'GET',
        url: host+'cars/'
        });
      
      get_all.then(function (response) {
      
        $scope.cars = response.data; //刷新数据列表
      
      }, function (response) {
        //alert(response);
      });

      $scope.car_list = false;
      $scope.rs = true;

  }

  //响应取消按钮
  $scope.cancel = function(){
    $scope.car_data_list = false;
    $scope.car_edit = true;
  }

  $scope.jumpToUrl = function(path) {
    $location.path(path);
    var curUrl = $location.absUrl(); 
    console.log(curUrl);
  }


});


