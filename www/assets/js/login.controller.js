'use strict';
//00395900001
//93473720001
//00395900301

angular.module('AbepomApp')
  .controller("forgotCtrl", function ($scope,$ionicHistory,$httpE) {
    $scope.confirmaForgot = function(){
      if($scope.formForgot.$valid){
        $httpE.post(arURL.urlforgot, $scope.inputForgot).then(function(data){
          feijor.log(data);
          if(data.data.envioEmail){
            $ionicHistory.goBack();
          }else{
            feijor.al('Não há registros para os dados digitados.');
          }
        });
      }else{
        feijor.al("Todos campos precisam estar preenchidos e válidos.");
      }
    }

    $scope.goBack = function() {
      $ionicHistory.goBack();
    }
  })
  .controller("loginCtrl", function ($scope,$httpE,$location,$ionicHistory) {
    $scope.login = function() {
      if($scope.formLogin.$valid){
        $httpE.post(arURL.urllogin, $scope.inpLogin).then(function(data){
          if(data.data.valido){
              data.data.associado.card = $scope.inpLogin.cartao;
              feijor.logon(data.data);

              $ionicHistory.clearHistory();
              $location.path('/app/home');
          }else{
            feijor.al(data.data.erro);
          }
        });
      }else{
        feijor.al("Preencha os dados no formulário para efetuar o login.")
      }
    }

    $scope.list = [];
      $scope.text = 'hello';

    $scope.submit = function() {
  if ($scope.text) {
    $scope.list.push(this.text);
    $scope.text = '';
  }
};
  });
