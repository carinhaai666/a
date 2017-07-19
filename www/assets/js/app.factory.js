'use strict';

angular.module('AbepomApp')

.factory('$httpE',function($http, $ionicLoading, $httpParamSerializerJQLike){
  return {
    post: function(url,fields) {
      $ionicLoading.show();
      try{
        return $http({
                    method: 'POST',
                    url: url,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: $httpParamSerializerJQLike(fields)
                  }).then(function successCallback(data) {
                    $ionicLoading.hide();
                    return data;
                  }, function errorCallback(data) {
                    $ionicLoading.hide();
                    feijor.al('Ouve um erro de conexão.');
                    return {'valido':0};
                  });
      }catch(err){
        $ionicLoading.hide();
      }
    }
  }
});
