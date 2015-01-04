angular.module('starter.controllers', ['ngStorage'])

.controller('DashCtrl', function($scope, $interval, $localStorage, $http, $window) {
    var n;
    data = [];
    if($localStorage.data == undefined){
      $http.get("http://kuas.grd.idv.tw:8888/query").success(function(response, status, header, config){
        len = response.length;
        for(i=0;i<response.length; i++){
          item = response[i];
          data.push({id: i, name: item.name, addr: item.addr, content: item.content, tags: item.tags});
        }
        if($localStorage.data == undefined || $localStorage!=data){
          $localStorage.data = data;      
        }
        $scope.food = filt("undefined");
      });
    }
    function filt(types){
        len = $localStorage.data.length;
        if(types=="undefined") return $localStorage.data[Math.floor(Math.random() * len.toFixed(2))];
        var temp = [];
        var i = 0;
        for(i = 0; i < $localStorage.data.length; i++){
            if($localStorage.data[i].tags.indexOf(types)!=-1){
                temp.push($localStorage.data[i]);
            }
        }
        if(temp.length == 0){
            return {name: "沒有東西", addr: ""};
        }else{
            return temp[Math.floor(Math.random() * temp.length.toFixed(2))];            
        }
    }
    if(typeof($localStorage.data) == "undefined"){
        $scope.food = {name: "Loading...", addr: "Loading..."};
    }else{
        $scope.food = filt("undefined");        
    }
    $scope.negtive = function(addr){
        window.open("http://maps.google.com.tw/maps?q=" + addr, "_system");
    }

    $scope.chg = function(tags){
        var temp = filt(tags);
        $scope.food = temp;
    }
    $scope.rnd = function(tags){
        var m = Math.random()*10+30;
        if (angular.isDefined(n)) return;
        tg = (typeof(tags) == 'undefined')?"undefined": tags;
        n = $interval(
            function(){            
                var t = filt(tg);
                while($scope.food==t){
                    t = filt(tg);
                }
                $scope.food = t;
            }
        , 100, m);
        var r = $interval(function(){n=undefined}, m*100, 1);
    }
})

.controller('FriendsCtrl', function($scope, food) {
  $scope.friends = food.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, food) {
  $scope.friend = food.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $http, $window) {
    $scope.position = null;
    $scope.food = {addr: ""};
    $scope.setPosition = function(food){
        $window.navigator.geolocation.getCurrentPosition(function(position) {
            x = position.coords.longitude;
            y = position.coords.latitude;

            x = x.toFixed(5);
            y = y.toFixed(5);

            $scope.food.addr = y + "," + x;
        }, function(){
            $window.alert("抓不到位置拉拉拉拉");
        },{ timeout: 500, enableHighAccuracy: false });
    }
    $scope.comment = function(food){
        if(food != undefined){
            var t = "";
            for(i=0;i<5; i++){
                if(food.tags[i] != undefined && t.indexOf(food.tags[i]) == -1){
                    t = t + food.tags[i] + ",";
                }
            }
            if(food.name!=undefined && food.addr!=undefined && food.content!=undefined && t!=""){
                $http({
                    method: "POST",
                    url: "http://kuas.grd.idv.tw:8888/add",
                    data: "name=" + food.name + "&addr=" + food.addr + "&content=" + food.content + "&tags=" + t,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                food.name = "";
                food.addr = "";
                food.content = "";
                $window.alert("新增成功");            
            }else{
                $window.alert("請先輸入東西");
            }
        }
    }
});
