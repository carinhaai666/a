'use strict';

angular.module('AbepomApp')
  .directive('lowercase', function () {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.cf = function(modelValue, viewValue) {
          ctrl.$parsers.push(function(input) {
            elm.css("text-transform", (input) ? "lowercase" : "");
            return input ? input.toUpperCase() : input;
          });
        }
      }
    };
  })
  .directive('uppercase', function () {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.cf = function(modelValue, viewValue) {
          ctrl.$parsers.push(function(input) {
            elm.css("text-transform", (input) ? "uppercase" : "");
            return input ? input.toUpperCase() : input;
          });
        }
      }
    };
  })
  .directive('selectOnClick', [function () {
      return {
          restrict: 'A',
          link: function (scope, element) {
              element.on('click', function () {
                  this.select();
              });
          }
      };
  }])
  .directive('numbersOnly', [function () {
      return {
          restrict: 'A',
          link: function (scope, element) {
              element.on('paste', function (event) {
                  event.preventDefault();
              });

              element.on('keypress', function (event) {
                  if (element.val().length >= 3) {
                      event.preventDefault();
                  }

                  var keyCode = (event.keyCode ? event.keyCode : event.which);

                  // Bloqueia caracteres diferentes de 0-9
                  if (keyCode < 48 || keyCode > 57) {
                      event.preventDefault();
                  }
              });
          }
      };
  }]);
