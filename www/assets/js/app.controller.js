'use strict';

angular.module('AbepomApp')
  .controller("menu", function ($scope, $ionicHistory, $ionicModal, $httpE, $rootScope, $location,$state,$http) {

    $rootScope.sendLocation = function(path) {
      if(path == '/app/home'){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $state.go('app.home');
      }else{
        $location.path(path);
      }
    };

    var varlo = {0:true,1:true};
    $scope.toggleMenu = function(objt) {
      $scope.isShownToggle(objt);
      varlo[objt] = !varlo[objt];
    };

    $scope.logoff = function(){
      $http.post('http://abepomobile.web1649.kinghost.net/delpush.php', {
                      "push": pushToken
                    }, {headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}});

      feijor.logoff;
    }

    $scope.isShownToggle = function(objt) {
      if(!varlo[objt])
        $scope['Axicon'+objt] = 'ion-chevron-down'
      else
        $scope['Axicon'+objt] = 'ion-chevron-right';

      return !varlo[objt];
    };

    $ionicModal.fromTemplateUrl('assets/templates/notifications.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) { $scope.modalnotification = modal; });

    $scope.open_notification = function(){
      $scope.modalnotification.show();
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'funcao':'verificarNotificacoes'}).then(function(data){
        feijor.log(data.data.notificacoes);
        $scope.notificacoes = data.data.notificacoes;
      });
    };
    $scope.fechanotifcation = function(){
      $scope.modalnotification.hide();
    };
    $scope.lemsg = function(id){
      $httpE.post(arURL.urlhome, {'id_notificacao':id,'funcao':'lerNotificacao'});
    };

    $scope.$on('$ionicView.enter', function () {
      $scope.usperfil = feijor.storage.user.associado.perfil;
      $scope.solicitar_auxilio = feijor.storage.user.associado.solicitar_auxilio;
    });
  })

  .controller("homeCtrl", function ($scope, $httpE, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
      $scope.usperfil = feijor.storage.user.associado.perfil;
      $scope.usnome = feijor.storage.user.associado.nome;
      $scope.uscartao = feijor.storage.user.associado.card;
      $scope.usimg = feijor.storage.user.associado.caminho_imagem;

      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'funcao':'visualizarLimites'}).then(function(data){
        feijor.log(data.data.naolidas);
        if(data.data.valido){
          $scope.medicamentos_e_tratamentos = data.data.limites.medicamentos_e_tratamentos;
          $scope.hospitalar_e_aparelhos_medicos = data.data.limites.hospitalar_e_aparelhos_medicos;

          $rootScope.contadornotificacoes = data.data.naolidas;
        }
      });
    });
  })

  .controller("descepecifico", function ($scope, $httpE) {
    var func = {"participacao":"descontosEspecificosCoparticipacao","hospitalar":"descontosEspecificosHospitalar",
    "farmacia":"descontosEspecificosFarmacia","odontologia":"descontosEspecificosOdontologia","radiologia":"descontosEspecificosRadiologia",
    "emprestimo":"descontosEspecificosEmprestimos"};
    $scope.liberamsg = true;
    $scope.liberatabela = false;

    function atualizaFiltro(){
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao, 'mes':$scope.inputdesesp.mes, 
                                  'ano':$scope.inputdesesp.ano, 'funcao':func[$scope.itemshow]}).then(function(data){


        console.log(data.data);
        $scope[$scope.itemshow] = data.data;
        $scope.liberatabela = true;

        switch($scope.itemshow) {
            case "participacao":
              if(data.data.descontos.length < 1 && data.data.procedimentos.length < 1){
                $scope.liberatabela = false;
                $scope[$scope.itemshow] = [];
              }
              break;
            case "hospitalar":
              var parcela = [];
              for(var i=1; i <= data.data.numero_maximo_parcelas; i++){
                parcela[parcela.length] = {"nome":i};
              }
              $scope.nparcelas = parcela;

              if(data.data.descontos.length < 1){
                $scope.liberatabela = false;
                $scope[$scope.itemshow] = [];
              }
              break;
            case "farmacia":
              if(data.data.descontos.length < 1){
                $scope.liberatabela = false;
                $scope[$scope.itemshow] = [];
              }
              break;
            case "odontologia":
              if(data.data.valido != 1){
                $scope.liberatabela = false;
                $scope[$scope.itemshow] = [];
              }
              break;
            case "radiologia":
            console.log(data.data.valido);
              if(data.data.valido == 0){
                $scope.liberatabela = false;
                $scope[$scope.itemshow] = [];
              }
              break;
            case "emprestimo":
              if(data.data.emprestimos.length < 1 && data.data.auxilios.length < 1){
                $scope.liberatabela = false;
                $scope[$scope.itemshow] = [];
              }
              break;
            default:
              $scope.liberatabela = false;
        }


        $scope.liberamsg = $scope.liberatabela;
      });
    }

    function changeitens(){
      if($scope.inputdesesp)
        if($scope.inputdesesp.ano && $scope.inputdesesp.mes && $scope.itemshow)
          atualizaFiltro();
    }

    $scope.activediv = function(objeto) {
      $scope.itemshow = objeto;
      changeitens();
    };

    $scope.parcelarhosp = function(inpparcelarhosp){
      if(inpparcelarhosp){
        inpparcelarhosp.funcao = 'parcelarDescontoHospitalar';
        inpparcelarhosp.cartao = feijor.storage.user.associado.cartao;

        $httpE.post(arURL.urlhome, inpparcelarhosp).then(function(data){
          if(data.data.valido){
            feijor.al(data.data.retorno)
            $scope.inpparcelarhosp = angular.copy({});
          }
        });
      }
    }

    $scope.mudasldesc = function(){
      changeitens();
    }

    $scope.$on('$ionicView.enter', function () {
      $scope.anos = geraAnos();
      $scope.meses = meses;

      $httpE.post(arURL.urlhome, {'id_tela':1, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido)
          $scope.texto = data.data.texto.descricao;
      });
    });
  })

  .controller("pesquisaconvenioCtrl", function ($scope, $httpE) {
    function atualizaFiltro(){
      $httpE.post(arURL.urlhome, {'area':$scope.inputPsConv.area.codigo_da_area,
                                  'codigo_cidade':$scope.inputPsConv.cidade.codigo_cidade,
                                  'funcao':'pesquisarConvenios'}).then(function(data){
                                    feijor.log(data.data);
        $scope.convenios = data.data.convenios;
        $scope.parceiros = data.data.parceiros;
        $scope.profissionais = data.data.profissionais;
        $scope.credenciados = data.data.credenciados;
      });
    }

    $scope.atualizaPesquisa = function(){
      if($scope.inputPsConv.area && $scope.inputPsConv.cidade){
        $scope.liberatabela = true;
        atualizaFiltro();
      }
    }

    $scope.selecAre = function(){
      $scope.liberatabela = false;
      $httpE.post(arURL.urlhome, {'codigo_area':$scope.inputPsConv.area.codigo_da_area, 'funcao':'comboCidadesPorArea'}).then(function(data){
        $scope.cidades = data.data.cidades;
      });
    }

    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'id_tela':2, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido)
          $scope.texto = data.data.texto.descricao;
      });

      if(!$scope.areas){
        $httpE.post(arURL.urlhome, {'funcao':'listarAreasDeAtuacao'}).then(function(data){
          $scope.areas = data.data.areas;
        });
      }
    });
  })

  .controller("dthospCtrl", function ($scope, $httpE, $stateParams) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'numero_lancamento':$stateParams.id,'funcao':'descontosEspecificosHospitalarDetalhes'}).then(function(data){
        feijor.lg(data.data.descontos);
        $scope.convenio = data.data.descontos;
      });
    });
  })

  .controller("historiconotificacaoCtrl", function ($scope, $httpE, $stateParams) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'funcao':'historicoDeNotificacoes'}).then(function(data){
        feijor.log(data.data.notificacoes);
        $scope.notificacoes = data.data.notificacoes;
      });
    });
  })

  .controller("dtodontCtrl", function ($scope, $httpE, $stateParams) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'id_do_orcamento':$stateParams.id,'funcao':'descontosEspecificosOdontologiaDetalhes'}).then(function(data){
        feijor.lg(data);
        $scope.orcamento = data.data.orcamento;
        $scope.parcelamento = data.data.parcelamento;
        $scope.procedimento = data.data.procedimentos;
      });
    });
  })

  .controller("dtemprestimoCtrl", function ($scope, $httpE, $stateParams) {
    $scope.$on('$ionicView.enter', function () {
      $scope.tipo = $stateParams.tipo;
      var fun = {'auxilio':'descontosEspecificosEmprestimosAuxilios','emprestimo':'descontosEspecificosEmprestimosDetalhes'};

      $httpE.post(arURL.urlhome, {'codigo_controle':$stateParams.id,'funcao':fun[$stateParams.tipo]}).then(function(data){
        feijor.lg(data);
        $scope[$stateParams.tipo] = data.data[$stateParams.tipo]
      });
    });
  })

  .controller("verconvenioCtrl", function ($scope, $httpE, $stateParams) {
    $scope.rating = 4;
    $scope.vlrinp = {rating : 1,max: 5};

    $scope.$watch('vlrinp.rating', function() {
      console.log('New value: '+$scope.vlrinp.rating);
      $scope.vlrinp.rating = $scope.rating;
    });

    $scope.share = function(arr){
      console.log(arr);
      var adress = arr.endereco[0].endereco+','+arr.endereco[0].numero+' - '+arr.endereco[0].nome_cidade+' '+arr.endereco[0].cep+' '+arr.endereco[0].bairro+
      ' - '+arr.endereco[0].complemento;
      window.plugins.socialsharing.shareWithOptions(arr.dados.nome + ': ' + adress,arr.dados.nome);
    }

    $scope.clicktocall = function(phone){
      window.plugins.CallNumber.callNumber(onSuccess, onError, phone);
    }

    function onSuccess(result){
      console.log("Success:"+result);
    }

    function onError(result) {
      console.log("Error:"+result);
    }

    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'codigo_do_convenio':$stateParams.id,'tipo_do_convenio':$stateParams.tipo,
                                  'funcao':'detalhesDoConvenio'}).then(function(data){
        feijor.log(data);
        $scope.arr = data.data;
        $scope.vlrinp.rating = data.data.dados.avaliacao;
        $scope.rating = data.data.dados.avaliacao;

      });
    });
  })

  .controller("convsugeCtrl", function ($scope, $httpE, $stateParams) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'funcao':'sugestaoDeConvenios'}).then(function(data){
        feijor.lg(data.data.sugestoes);
        $scope.sugestoes = data.data.sugestoes;
      });
    });
  })

  .controller("convproxCtrl", function ($scope,$httpE,$stateParams,$cordovaGeolocation,$ionicModal,$rootScope,$timeout) {
    var filter, infoWindow, iconBase, icons, textSearch, timer;

    infoWindow = new google.maps.InfoWindow();
    iconBase = 'assets/img/maps/';
    icons = {with: {icon: iconBase + 'estrela.png'},without: {icon: iconBase + 'semestrela.png'}};

    $ionicModal.fromTemplateUrl('assets/templates/popupareas.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) { $rootScope.popuparea = modal; });

    $scope.openarea = function(){
      $rootScope.popuparea.show();
      $httpE.post(arURL.urlhome, {'funcao':'listarAreasDeAtuacao'}).then(function(data){
        $scope.areas = data.data.areas;
        console.log(data);
      });
    }

    $scope.atualizaText = function(search){
      try{
        $timeout.cancel(timer);
      }catch(err){}
      textSearch = search;

      timer = $timeout(function(){
        markerCluster.clearMarkers();
        addPins();
      }, 2000);
    }

    $scope.closepopuparea = function(area){
      $rootScope.popuparea.hide();
      markerCluster.clearMarkers();
      filter = area;
      addPins();
    }

    $scope.$on('$ionicView.enter', function () {
      filter = '0000';

      if(ionic.Platform.isAndroid()){
        feijor.al("Lembre-se de sempre ativar o GPS ao entrar nessa tela.")
      }

      getUserPosition(function(position){
        if(position){
          feijor.latitude = position.coords.latitude;
          feijor.longitude = position.coords.longitude;
          createmap();
          addPins();
        }else{
          feijor.al("Falha no carregamento da GeoLocalização.");
        }
      });
    });

    function getUserPosition(callback) {
      function onSuccess(position) {
        callback(position);
      };
      function onError(position) {
        callback(false);
      };
      $cordovaGeolocation.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true
      }).then(onSuccess,onError);
    };

    function createmap(){
      var latlng = new google.maps.LatLng(feijor.latitude, feijor.longitude);
      var myOptions = {zoom: 14,center: latlng,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.ROADMA,styles:[{featureType: "poi",stylers: [{ visibility: "on" }]}]};
      map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
      var userMarker = new google.maps.Marker({position: latlng, map: map, icon: 'assets/img/maps/bluecircle.png' });
    }

    function loadpins(callback) {
      function onSuccess(data) {
        var pinsAPI = data.data.profissionais.concat(data.data.convenios.concat(data.data.credenciados.concat(data.data.parceiros)));
        if(textSearch){
          var pinsAPIinFilters = [];
          var pos = -1;
          try{
            for(var item in pinsAPI){
              try{
                pos = pinsAPI[item].endereco.toUpperCase().indexOf(textSearch.toUpperCase());
              }catch(err){
                pos = -1;
              }
              if(pos > -1){
                pinsAPIinFilters.push(pinsAPI[item]);
              }
            }
          }catch(err){
            pinsAPI = pinsAPIinFilters;
          }
          pinsAPI = pinsAPIinFilters;
        }
        callback(pinsAPI);
      };
      $httpE.post(arURL.urlhome, {'codigo_da_area':filter,'latitude':feijor.latitude,'longitude':feijor.longitude,'funcao':'listarConveniosPorArea'}).then(onSuccess);
    };

    function addPins(){
      loadpins(function(pinsLoction){
        console.log(pinsLoction);
        for(var i = 0; i < pinsLoction.length; i++){
          pinsLoction[i].lat = parseFloat(pinsLoction[i].latitude);
          pinsLoction[i].lng = parseFloat(pinsLoction[i].longitude);
        }

        if(pinsLoction.length > 0){
          var markers = pinsLoction.map(function(location, i) {
             var marker = new google.maps.Marker({
                              position: new google.maps.LatLng(location.lat, location.lng),
                              icon: (location.icone ? location.icone : icons['with'].icon)});
            google.maps.event.addListener(marker, 'click', function() {
              var iwContent = '<div class="iw_container">' +
              '<div class="iw_title">'+location.nome+'</div>' +
              '<div class="iw_area">'+location.area+'</div>' +
              '<div class="iw_itens">'+location.telefone+'</div>' +
              '<div class="iw_itens">'+location.endereco+' '+location.bairro+' '+location.complemento+'</div>' +
              '<div class="iw_itens">CEP:'+location.cep+'</div>' +
              '</div>';

              infoWindow.setContent(iwContent);
              infoWindow.open(map, marker);
            });
            return marker;
          });

          markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'assets/img/maps/m'});
        }
      })
    }
  })

  .controller("auxsolicCtrl", function ($scope, $httpE, $stateParams) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'funcao':'auxiliosSolicitados'}).then(function(data){
        feijor.lg(data.data);
        $scope.auxilios = data.data.auxilios;
      });
    });
  })

  .controller("soliauxCtrl", function ($scope, $httpE, $location,$ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
      var history = $ionicHistory.viewHistory();
      var clean = false;
      angular.forEach(history.views, function(view, index){
          if(view.stateName == 'app.soliaux2'){
            clean = false;
          }else{
            clean = true;
          }
      });

      if(clean){
        try{
          $scope.inputSolAux = angular.copy({});
          $scope.inputSolAuxParc = angular.copy({});
          $scope.nparcelas = [];
        }catch(err){}
      }

      $httpE.post(arURL.urlhome, {'funcao':'comboCidades'}).then(function(data){
        $scope.cidades = data.data.cidades;
      });
    });

    $scope.simulaParc = function(){
      $httpE.post(arURL.urlhome, {'funcao':'comboParcelamento','valor':$scope.inputSolAux.valor_total}).then(function(data){
        $scope.nparcelas = data.data.parcelamento;
      });
    }

    $scope.confirmaStep1 = function(){
      var obj = JSON.parse($scope.inputSolAuxParc.parcelas);
      obj.parcelas = obj.numero_parcelas;
      obj = Object.assign({}, obj, $scope.inputSolAux);
      obj.cartao = feijor.storage.user.associado.cartao;

      $httpE.post(arURL.inserirSolicitacaoDeAuxilio, obj).then(function(data){
        if(data.data.inserido == 0)
          feijor.al(data.data.retorno)
        else
          $location.path('/app/soliaux2/'+data.data.solicitacao.id_solicitacao_auxilio);
      });
    }
  })

  .controller("soliaux2Ctrl", function ($scope,$ionicHistory,$httpE,$http,$state,$stateParams,$ionicActionSheet,$cordovaCamera,$httpParamSerializerJQLike) {
    var imgCam = '';

    $scope.$on('$ionicView.enter', function () {
      $scope.imgBase = 'assets/img/not-img.png';
    });

    $scope.confirma = function(){
      $http({
        method: 'POST',
        url: arURL.inserirSolicitacaoDeAuxilio_passo2,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $httpParamSerializerJQLike({'cartao':feijor.storage.user.associado.cartao,'id_solicitacao':$stateParams.id,'imagem':imgCam})
      }).then(function successCallback(data) {
          feijor.al("Inserido com sucesso.");
          $ionicHistory.nextViewOptions({disableBack: true});
          $state.go('app.auxsolic');
      }, function errorCallback(data) {
          feijor.al("Inserido com sucesso.");
          $ionicHistory.nextViewOptions({disableBack: true});
          $state.go('app.auxsolic');
      });
    }

    $scope.setaimg = function(){
      var hideSheet = $ionicActionSheet.show({
        buttons: [{text: 'Galeria'},{text: 'Camera'}],
        titleText: 'Selecione uma opção',
        cancelText: 'Cancelar',
        buttonClicked: function(index){
          getPic(index);
          return true;
        }
      });
    }

    function getPic(index){
      var arrayPic = [Camera.PictureSourceType.PHOTOLIBRARY,Camera.PictureSourceType.CAMERA];
      var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: arrayPic[index],
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          allowEdit: true,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
          imgCam = imageData;
          $scope.imgBase = 'data:image/jpeg;base64,' + imageData;
        }, function(err) {});
    }
  })

  .controller("avaliconvCtrl", function ($scope, $httpE, $stateParams) {
    $scope.rating = 4;
    $scope.inptavalia = {
      rating : 1,
      max: 5
    };

    $scope.$watch('data.rating', function() {
      console.log('New value: '+$scope.inptavalia.rating);
    });

    $scope.avaliarConv = function(){
      if($scope.inptavalia.descricao == undefined){
        feijor.al("Você precisa deixar um comentário.");
        return false;
      }
      var data = {'cartao':feijor.storage.user.associado.cartao,'codigo_convenio':$scope.avaliacao[$scope.index].codigo_cadastro,'tipo_convenio':$scope.avaliacao[$scope.index].tipo_cadastro,'nota':$scope.inptavalia.rating,'comentario':$scope.inptavalia.descricao};
      console.log({'cartao':feijor.storage.user.associado.cartao,'codigo_convenio':$scope.avaliacao[$scope.index].codigo_cadastro,'tipo_convenio':$scope.avaliacao[$scope.index].tipo_cadastro,'nota':$scope.inptavalia.rating,'comentario':$scope.inptavalia.descricao});

      $httpE.post(arURL.urlavaliarConvenio, data).then(function(data){
        if(data.data.inserido == 1){
          feijor.al("Enviado com sucesso.");
          $scope.inptavalia = {rating : 1,max: 5};
          $scope.pular();
        }else{
          feijor.al(data.data.retorno);
        }
      });
    }

    $scope.pular = function(){
      $scope.index = $scope.index+1;
    }

    $scope.$on('$ionicView.enter', function () {
      $scope.return = 'Não há nenhuma avaliação pendente para ser mostrada.';

      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'funcao':'listarAvaliacoes'}).then(function(data){
        if(data.data.valido == 1){
          $scope.avaliacao = data.data.avaliacoes_pendentes;
          $scope.hidetitle = false;
          $scope.index = 0;
        }else{
          $scope.return = data.data.retorno;
          $scope.avaliacao = [{}];
          $scope.index = 1;
          $scope.hidetitle = true;
        }
      });
    });
  })

  .controller("sugerirconvenios", function ($scope,$httpE,$ionicHistory,$state) {

    $scope.$on('$ionicView.enter', function () {
      if(!$scope.areas){
        $httpE.post(arURL.urlhome, {'funcao':'listarAreasDeAtuacao'}).then(function(data){
          $scope.areas = data.data.areas;
        });
      }
      if(!$scope.cidades){
        $httpE.post(arURL.urlhome, {'funcao':'comboCidades'}).then(function(data){
          $scope.cidades = data.data.cidades;
        });
      }
    });

    $scope.confirmaSugConv = function(){
      $scope.inputSeConve.cartao = feijor.storage.user.associado.cartao;

      $httpE.post(arURL.urlsugerir, $scope.inputSeConve).then(function(data){
        feijor.lg(data);
        if(data.data.valido){
          feijor.al("Inserido com sucesso.");
          $ionicHistory.nextViewOptions({disableBack: true});
          $state.go('app.home');
        }else{
          feijor.al(data.data.retorno);
        }
      });
    }

  })

  .controller("cdescontoCtrl", function ($scope,$httpE,$ionicHistory) {
    function atualizaFiltro(){
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao, 'mes':$scope.inputdesc.mes, 
                                  'ano':$scope.inputdesc.ano, 'funcao':'consultarDescontos'}).then(function(data){
        if(!data.data.contra_cheque)
          data.data.contra_cheque = [];
        if(!data.data.conta_corrente)
          data.data.conta_corrente = [];
        if(!data.data.estorno)
          data.data.estorno = [];

        var valorTotal = 0;
        var arrayDesc = data.data.contra_cheque.concat(data.data.conta_corrente.concat(data.data.estorno));

        $scope.descontos = arrayDesc;

        $scope.liberatabela = (arrayDesc.length > 0);

        for(var i = 0; i < arrayDesc.length; i++){
          valorTotal = valorTotal + arrayDesc[i].valor;
        }
        $scope.valorTotal = valorTotal;
      });
    }

    $scope.$on('$ionicView.enter', function () {
      $scope.liberatabela = true;
      if(feijor.storage.user.associado.perfil == 'titular'){
        $scope.showdesc = true;
        $scope.page_title = 'Consultar Descontos';
      }else{
        $scope.showdesc = false;
        $scope.page_title = 'Minhas despesas';
      }

      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth();
      if((month + 1) > 12){
        year = year+1;
        month = 1;
      }else{
        month = month + 2;
      }

      $scope.anos = geraAnos();
      $scope.meses = mesesl;

      $httpE.post(arURL.urlhome, {'id_tela':1, 'funcao':'consultarBanner'}).then(function(data){
        if(data.data.valido == 1){
          $scope.caminho_imagem = data.data.imagem.caminho_imagem;
        }else{
          $scope.caminho_imagem = 'assets/img/pic1.png';
        }
      });
    });

    $scope.mudasldesc = function(){
      if($scope.inputdesc.ano && $scope.inputdesc.mes){
        $scope.liberatabela = true;
        atualizaFiltro();
      }
    }

  })

  .controller("descontoCtrl", function ($scope,$httpE,$ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth();

      if((month + 1) > 12){
        year = year+1;
        month = 1;
      }else{
        month = month + 2;
      }
      $scope.titulo = voltapromes();

      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao, 'funcao':'consultarDescontosFuturos'}).then(function(data){
        $scope.convenios = data.data.convenios;
        $scope.hospital = data.data.hospital;
        $scope.juridico = data.data.juridico;
        $scope.hotel = data.data.hotel;

        var valor = 0;
        for(var i = 0; i < $scope.convenios.length; i++) valor = valor + $scope.convenios[i].valor;
        for(var i = 0; i < $scope.hospital.length; i++) valor = valor + $scope.hospital[i].valor;
        for(var i = 0; i < $scope.juridico.length; i++) valor = valor + $scope.juridico[i].valor;
        for(var i = 0; i < $scope.hotel.length; i++) valor = valor + $scope.hotel[i].valor;

        $scope.valortotal = valor;
      });

      $httpE.post(arURL.urlhome, {'id_tela':5, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido)
          $scope.texto = data.data.texto.descricao;
      });
    });
  })

  .controller("detalhesDoDescontoCtrl", function ($scope,$httpE,$stateParams) {
    $scope.$on('$ionicView.enter', function () {
      $scope.titulo = voltapromes();

      $httpE.post(arURL.urlhome, {'codigo_desconto':$stateParams.id,'tipo_desconto':$stateParams.tipo, 'funcao':'consultarDescontosFuturosDetalhes'}).then(function(data){
        $scope.desdtl = data.data.descontos;
      });
    });
  })

  .controller("cardCtrl", function ($scope,$httpE,$ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'id_tela':3, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido)
          $scope.texto = data.data.texto.descricao;
      });
    });
  })

  .controller("beneficioservCtrl", function ($scope,$httpE,$ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'id_tela':4, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido)
          $scope.texto = data.data.texto.descricao;
      });
    });
  })

  .controller("meusdependentesCtrl", function ($scope,$httpE,$ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
      atualizatela();

      $httpE.post(arURL.urlhome, {'id_tela':6, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido == 1)
          $scope.text6 = data.data.texto.descricao;
      });

      $httpE.post(arURL.urlhome, {'id_tela':7, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido == 1)
          $scope.text7 = data.data.texto.descricao;
      });

      $httpE.post(arURL.urlhome, {'id_tela':8, 'funcao':'textoExplicativo'}).then(function(data){
        if(data.data.valido == 1)
          $scope.text8 = data.data.retorno;
      });
    });

    function atualizatela(){
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao, 'funcao':'listarDependentes'}).then(function(data){
        feijor.log(data.data.dependentes);
        $scope.dependentes = data.data.dependentes;
      });
    }

    $scope.liberaDp = function(cartao){
      $httpE.post(arURL.validarCartao, {'cartao':cartao}).then(function(data){
        console.log(data);
        atualizatela();
      });

    }

  })

  .controller("conssultconvenioCtrl", function ($scope,$httpE,$ionicHistory,$stateParams,$state) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'funcao':'liberarConvenioAoDependente'}).then(function(data){
        feijor.log(data.data);
        $scope.convenios = data.data;
      });
    });
  })

  .controller("liberardependenteCtrl", function ($scope,$httpE,$ionicHistory,$stateParams,$state,$rootScope) {
    var itens;

    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'dependente':$stateParams.id,'funcao':'liberarConvenioAoDependente'}).then(function(data){
        feijor.log(data.data);
        $scope.convenios = data.data;
      });
    });

    $scope.confmLibConv = function(inpAtu){
      var permitidos = '';
      var negados = '';
      var virgulap = '';
      var virgulan = '';
      var areas = $scope.convenios.areas;

      for(var i=0; i < areas.length; i++){
        if(areas[i].negado == 1 && areas[i].permitido == 0){
          negados += virgulan + areas[i].codigo_area;
          virgulan = ',';
        }
        if(areas[i].negado == 0 && areas[i].permitido == 1){
          permitidos += virgulap + areas[i].codigo_area;
          virgulap = ',';
        }
      }

      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao,'dependente':$stateParams.id,'areas_permitidas':permitidos,'areas_negadas':negados,'funcao':'inserirPermissaoAoDependente'}).then(function(data){
        feijor.log(data);
        if(data.data.valido == 1){
          feijor.al(data.data.retorno);
          $ionicHistory.nextViewOptions({disableBack: true});
          $state.go('app.liberarconvenio');
        }else{
          feijor.al('Erro ao executar');
        }
      });

    }

    $scope.mudaAll = function(type){
      var areas = $scope.convenios;
      console.log(areas);

      for(var i=0; i < areas.areas.length; i++){
        areas.areas[i].permitido = (type ? 1 : 0);
        areas.areas[i].negado = (type ? 0 : 1);
        areas.areas[i].obj.chkP = type;
        areas.areas[i].obj.chkN = !type;

      }
      console.log(areas);
      $scope.convenios = areas;

      $scope.allaplic.chkN = true;
      $scope.allaplic.chkP = true;
    }
  })

  .controller("liberarconvenioCtrl", function ($scope,$httpE,$ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
      $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao, 'funcao':'selecionarDependente'}).then(function(data){
        feijor.log(data.data.dependentes);
        $scope.dependentes = data.data.dependentes;
      });
    });
  })

  .controller("configCtrl", function ($scope,$httpE,$ionicHistory,$ionicActionSheet,$cordovaCamera,$rootScope,$window) {
    $scope.$on('$ionicView.enter', function () {
      $scope.usimg = feijor.storage.user.associado.caminho_imagem;
      $httpE.post(arURL.urlhome, {'funcao':'comboCidades'}).then(function(data){
        $scope.cidades = data.data.cidades;
        $httpE.post(arURL.urlhome, {'cartao':feijor.storage.user.associado.cartao, 'funcao':'visualizarDados'}).then(function(data){
          $scope.selectedItem = data.data.dados.codigo_cidade;
          $scope.inpChangeUser = data.data.dados;
        });
      });
    });

    $scope.atualizaPhoto = function(){
      var hideSheet = $ionicActionSheet.show({
        buttons: [{text: 'Galeria'},{text: 'Camera'}],
        titleText: 'Selecione uma opção',
        cancelText: 'Cancelar',
        buttonClicked: function(index){
          getPic(index);
          return true;
        }
      });
    }

    function getPic(index){
      var arrayPic = [Camera.PictureSourceType.PHOTOLIBRARY,Camera.PictureSourceType.CAMERA];
      var options = {
      		quality: 50,
      		destinationType: Camera.DestinationType.DATA_URL,
      		sourceType: arrayPic[index],
      		encodingType: Camera.EncodingType.JPEG,
      		targetWidth: 300,
      		targetHeight: 300,
      		allowEdit: true,
      		popoverOptions: CameraPopoverOptions,
      		saveToPhotoAlbum: false,
      	  correctOrientation:true
      	};

        $cordovaCamera.getPicture(options).then(function(imageData) {
          sendImagem(imageData);
      	}, function(err) {});
    }

    function sendImagem(base64){
      $httpE.post(arURL.validarEnvioImagemPerfil, {"imagem":base64,'cartao':feijor.storage.user.associado.cartao,'tipo_perfil':feijor.storage.user.associado.perfil}).then(function(data){
        if(data.data.imagem.valido == 1){
          feijor.storage.user.associado.caminho_imagem = 'data:image/jpeg;base64,' + base64;
          $scope.usimg = 'data:image/jpeg;base64,' + base64;
        }else{
          feijor.al(data.data.imagem.retorno);
        }
      });
    }

    $scope.atualizaDados = function () {
      if($scope.formChangeUser){
        $scope.inpChangeUser.cartao = feijor.storage.user.associado.cartao;
        $httpE.post(arURL.atualizardados + feijor.storage.user.associado.cartao, $scope.inpChangeUser).then(function(data){
          feijor.log(data);
          if(data.atualizado)
            feijor.al("Atualizado");
        });
      }else{
        feijor.al("Todos campos devem estar preenchidos e válidos.");
      }
    }

    $scope.atulizaSeha = function () {
      if($scope.formChangePass.$valid){
        $scope.inpChangePass.cartao = feijor.storage.user.associado.cartao
        $httpE.post(arURL.urlpass, $scope.inpChangePass).then(function(data){
          feijor.log(data);
          if(data.data.atualizado){
            feijor.al("Atualizado com sucesso.");
          }else{
            feijor.al(data.data.retorno);
          }
        });
      }else{
        feijor.al("Todos campos precisam estar preenchidos.");
      }
      feijor.log($scope.formChangePass.$valid);
      feijor.log();
    }

  });
