
var host = "http://192.168.1.21:8081/";

var indexApp = angular.module('indexApp', []);

indexApp.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);  
}]); 

indexApp.controller('indexCtrl', function($scope,$http, $location) {

  $scope.gotoHome = function(data){
    $location.path("/home");
    console.log($location.path());
    window.location="/home?"+data;
    //window.open("/home");
  }

});


