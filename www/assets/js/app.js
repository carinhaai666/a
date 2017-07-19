'use strict';

angular.module('AbepomApp', ['ionic', 'ngCordova', 'ionic.native', 'angularMoment','ui.utils.masks','ionic.rating'])
    .run(function ($ionicPlatform,$rootScope,$location,amMoment,$cordovaSplashscreen,$cordovaPushV5,$interval,$http) {
      amMoment.changeLocale('pt-br');
        $ionicPlatform.ready(function () {
          if (ionic.Platform.isWebView()) {
            if (window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
              StatusBar.styleDefault();
            }
            $cordovaSplashscreen.hide();
          }
          var varClass = ['', 'api', 'ABEPOM', '', '', '/app/home'];

          feijor = new classFeijor(varClass);
          feijor.login;

          if (feijor.storage.user != false) {
            if (ionic.Platform.isWebView() && $location.path() == '/nLog/login') {
              $location.path('/app/home');
            }else{
              feijor.storage.user.associado.solicitar_auxilio = 1;
            }
          } else {
            $location.path('/nLog/login');
          }

          $cordovaPushV5.initialize({android: {senderID: "100537186328"},ios: {alert: "true",badge: "true",sound: "true"}}).then(function () {
            $cordovaPushV5.onNotification();
            $cordovaPushV5.onError();
            $cordovaPushV5.register().then(function (deviceToken) {
              pushToken = deviceToken;

              var updateTokenTimer = $interval(function () {
                  if (pushToken != '' && (feijor.storage.user != false)) {
                    $http.post('http://abepomobile.web1649.kinghost.net/setpush.php', {
                      "cartao": feijor.storage.user.associado.card,
                      "nome": feijor.storage.user.associado.nome,
                      "plataform": device.platform.toUpperCase(),
                      "push": pushToken
                    }, {headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}});
                    $interval.cancel(updateTokenTimer);
                  }
              }, 20000);
            })
          });
        });
    })
    .config(function ($stateProvider,$ionicConfigProvider,$urlRouterProvider) {
        $stateProvider
          .state('nLog', {
            url: '/nLog',
            abstract: true,
            templateUrl: 'assets/templates/nLog.html'
          })
          .state('nLog.login', {
            url: '/login',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/login.html',
                cotroller: "loginCtrl"
              }
            }
          })
          .state('nLog.forgot', {
            url: '/forgot',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/forgot.html',
                controller: "forgotCtrl"
              }
            }
          })
          .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'assets/templates/menu.html',
            controller: "menu"
          })
          .state('app.home', {
            url: '/home',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/home.html',
                controller: 'homeCtrl'
              }
            }
          })
          .state('app.card', {
            url: '/card',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/card.html',
                controller: 'cardCtrl'
              }
            }
          })
          .state('app.beneficioseserv', {
            url: '/beneficioseserv',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/beneficioseserv.html',
                controller: 'beneficioservCtrl'
              }
            }
          })
          .state('app.liberarconvenio', {
            url: '/liberarconvenio',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/liberarconvenio.html',
                controller: 'liberarconvenioCtrl'
              }
            }
          })
          .state('app.conssultconvenio', {
            url: '/conssultconvenio',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/conssultconvenio.html',
                controller: 'conssultconvenioCtrl'
              }
            }
          })
          .state('app.liberardependente', {
            url: '/liberardependente/:id',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/liberardependente.html',
                controller: 'liberardependenteCtrl'
              }
            }
          })
          .state('app.meusdependentes', {
            url: '/meusdependentes',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/meusdependentes.html',
                controller: 'meusdependentesCtrl'
              }
            }
          })
          .state('app.convenioprox', {
            url: '/convenioprox',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/convenioprox.html',
                controller: 'convproxCtrl'
              }
            }
          })
          .state('app.pesquisarconvenios', {
            url: '/pesquisarconvenios',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/pesquisarconvenios.html',
                controller: 'pesquisaconvenioCtrl'
              }
            }
          })
          .state('app.verconvenio', {
            url: '/verconvenio/:id/:tipo',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/verconvenio.html',
                controller: 'verconvenioCtrl'
              }
            }
          })
          .state('app.planben', {
            url: '/planben',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/planben.html'
              }
            }
          })
          .state('app.descontofuturo', {
            url: '/descontofuturo',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/descontofuturo.html',
                controller: 'descontoCtrl'
              }
            }
          })
          .state('app.detalhesDoDesconto', {
            url: '/detalhesDoDesconto/:id/:tipo',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/detalhesDoDesconto.html',
                controller: 'detalhesDoDescontoCtrl'
              }
            }
          })
          .state('app.sugerirconvenios', {
            url: '/sugerirconvenios',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/sugerirconvenios.html',
                controller: 'sugerirconvenios'
              }
            }
          })
          .state('app.cdescontos', {
            url: '/cdescontos',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/cdescontos.html',
                controller: 'cdescontoCtrl'
              }
            }
          })
          .state('app.descespecial', {
            url: '/descespecial',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/descespecial.html',
                controller: 'descepecifico'
              }
            }
          })
          .state('app.dthosp', {
            url: '/dthosp/:id',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/dthosp.html',
                controller: 'dthospCtrl'
              }
            }
          })
          .state('app.historiconotificacao', {
            url: '/historiconotificacao',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/historiconotificacao.html',
                controller: 'historiconotificacaoCtrl'
              }
            }
          })
          .state('app.dtodont', {
            url: '/dtodont/:id',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/dtodont.html',
                controller: 'dtodontCtrl'
              }
            }
          })
          .state('app.dtemprestimo', {
            url: '/dtemprestimo/:id/:tipo',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/dtemprestimo.html',
                controller: 'dtemprestimoCtrl'
              }
            }
          })
          .state('app.configuracoes', {
            url: '/configuracoes',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/configuracoes.html',
                controller: 'configCtrl'
              }
            }
          })
          .state('app.avaliconv', {
            url: '/avaliconv',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/avaliconv.html',
                controller: 'avaliconvCtrl'
              }
            }
          })
          .state('app.convsuge', {
            url: '/convsuge',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/convsuge.html',
                controller: 'convsugeCtrl'
              }
            }
          })
          .state('app.soliaux', {
            url: '/soliaux',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/soliaux.html',
                controller: 'soliauxCtrl'

              }
            }
          })
          .state('app.soliaux2', {
            url: '/soliaux2/:id',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/soliaux2.html',
                controller: 'soliaux2Ctrl'

              }
            }
          })
          .state('app.auxsolic', {
            url: '/auxsolic',
            views: {
              'menuContent': {
                templateUrl: 'assets/templates/auxsolic.html',
                controller: 'auxsolicCtrl'
              }
            }
          });

        $urlRouterProvider.otherwise('/nLog/login');

        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(false);

    });
