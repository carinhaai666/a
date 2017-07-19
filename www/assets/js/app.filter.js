'use strict';

angular.module('AbepomApp')

  .filter('sumOfValue', function () {
    return function (data, key) {
        console.log(data);
        console.log(key);
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data,function(value){
            sum = sum + parseFloat(value[key]);
        });
        return sum;
    }
  });
