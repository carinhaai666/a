var host = 'http://mobile.abepom.org.br:3973';
//var host = 'http://189.85.186.122:3979';
var pushToken;

var arURL = {
  urllogin: host+'/mobile/validarLogin.asp',
  urlforgot: host+'/mobile/esqueceuSenha.asp',
  urlsugerir: host+'/mobile/inserirSugestaoConvenio.asp',
  atualizardados: host+'/mobile/atualizarDados.asp?cartao=',
  urlpass: host+'/mobile/atualizarSenha.asp',
  urlavaliarConvenio: host+'/mobile/avaliarConvenio.asp',
  validarCartao: host+'/mobile/validarCartao.asp',
  inserirSolicitacaoDeAuxilio: host+'/mobile/inserirSolicitacaoDeAuxilio.asp',
  inserirSolicitacaoDeAuxilio_passo2: host+'/mobile/inserirSolicitacaoDeAuxilio_passo2.asp',
  validarEnvioImagemPerfil: host+'/mobile/validarEnvioImagemPerfil.asp',
  urlhome: host+'/mobile/utils.asp'
};

var meses = {
  '01':'Janeiro',
  '02':'Fevereiro',
  '03':'Março',
  '04':'Abril',
  '05':'Maio',
  '06':'Junho',
  '07':'Julho',
  '08':'Agosto',
  '09':'Setembro',
  '10':'Outubro',
  '11':'Novembro',
  '12':'Dezembro'
};

var mesesl = {
  '1':'Janeiro',
  '2':'Fevereiro',
  '3':'Março',
  '4':'Abril',
  '5':'Maio',
  '6':'Junho',
  '7':'Julho',
  '8':'Agosto',
  '9':'Setembro',
  '10':'Outubro',
  '11':'Novembro',
  '12':'Dezembro'
};

var feijor, map, markerCluster;

Array.prototype.set = function(key, value){
  feijor.lg(key);
  feijor.lg(value);
}

function voltapromes(){
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();

  if((month + 1) > 12){
    year = year+1;
    month = 1;
  }else{
    month = month + 2;
  }
  return mesesl[month] + ' ' + year;
}

function geraAnos(){
  var anos = [];
  var today = new Date();
  var year = today.getFullYear();

  for(var i = 0; i < 10; i++){
    anos.push(year);
    year = year-1;
  }

  return anos;
}
