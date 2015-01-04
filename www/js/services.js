angular.module('starter.services', ['ionic', 'ngStorage'])

/**
 * A simple example service that returns some data.
 */
.factory('food', function($http, $window, $localStorage){
  var data = [];
  var len;
  $http.get("http://kuas.grd.idv.tw:8888/query").success(function(response, status, header, config){
    len = response.length;
    for(i=0;i<response.length; i++){
      item = response[i];
      data.push({id: i, name: item.name, addr: item.addr, content: item.content, tags: item.tags});
    }
    if($localStorage.data == undefined || $localStorage!=data){
      $localStorage.data = data;      
    }
  });
  return {
    all: function(){
      return $localStorage.data;
    },
    get: function(id){
      return $localStorage.data[id];
    },
    filt: function(tp){
      if(tp=="undefined") return $localStorage.data[Math.floor(Math.random() * len.toFixed(2))];
      var temp = $localStorage.data[Math.floor(Math.random() * len.toFixed(2))];
      while(temp['tags'].indexOf(tp)==-1){
        temp = $localStorage.data[Math.floor(Math.random() * len.toFixed(2))];        
      }
      return temp;
    }
  }
})
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
