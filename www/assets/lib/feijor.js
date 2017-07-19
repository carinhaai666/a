class classFeijor {

  constructor(createVars) {

    this.urlsite = createVars[0];
    this.api = createVars[0]+createVars[1]+'/';
    this.nameApp = createVars[2];
    this.idProject = createVars[3];
    this.token = createVars[4];
    this.pageindex = createVars[5];
    this.Ahead = {headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}};
    this.options = {android: {senderID: this.idProject},ios: {alert: "true",badge: "true",sound: "true"}, windows: {}};
    this.storage = {'user': false};

  }

  al(msg){
    try{
      navigator.notification.alert(msg,function(){},this.nameApp,'Ok');
    }catch(err){
      alert(msg);
    }
  }

  log (msg) {
    console.log(msg);
  }

  lg (msg) {
    console.log(this.ajs(msg));
  }

  ajs (arr){
    return JSON.stringify(arr);
  }

  get login (){
    this.storage.user = this.getLocalStorage('user','object');
  }

  get logoff (){
    this.removeLocalStorage('user');
    this.storage.user = false;
  }

  logon (value){
    this.setLocalStorage('user',this.ajs(value));
  }

  relogon (value){
    this.removeLocalStorage('user');
    this.setLocalStorage('user',this.ajs(value));
  }

  get setnewproperty (){
    var objStorage = Object.keys(this.storage);
    for(var i = 0; i < objStorage.length; i++){
      this.setLocalStorage(objStorage[i],this.ajs(this.storage[objStorage[i]]));
    }
  }

  getLocalStorage (field, format) {
    var value = localStorage.getItem(field);
    if(value) {

      switch(format) {
        case 'object':
          try {
            return JSON.parse(value);
          } catch(e) {
            return value;
            console.log("localStorage '"+field+"' não esta em formato de objeto");
          }
        break;

        default:
          return value;
      }

    } else {
      return false;
    }
  }

  setLocalStorage (field, value) {
    localStorage.setItem(field, value);

    if(typeof this.storage.field != undefined) {
      try {
        this.storage[field] = JSON.parse(value);
      } catch(e){
        this.storage[field] = value;
      }
    }
  }

  removeLocalStorage (field) {
    localStorage.removeItem(field);

    if(typeof this.storage.field != undefined) {
      this.storage[field] = false;
    }
  }

  createToken (){
    var result = '';
    for (var i = 40; i > 0; --i) result += (Math.floor(Math.random()*256)).toString(16);
    return result;
  }

  isInArray (array, search){
    return array.indexOf(search) >= 0;
  }

  get onSuccess (){
    console.log("success");
  }

  get onError (){
    console.log("fail");
  }

  createLink (img){
    return img.indexOf('://') > 1 ? img : this.urlsite + img;
  }

};

String.prototype.replaceAll = function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.indexOfObject = function arrayObjectIndexOf(property, value) {
  for (var i = 0, len = this.length; i < len; i++) {
    if (this[i][property] === value) return i;
  }
  return -1;
}

google.maps.Map.prototype.markers = new Array();

google.maps.Map.prototype.getMarkers = function() {
    return this.markers
};

google.maps.Map.prototype.clearMarkers = function() {
    for(var i=0; i<this.markers.length; i++){
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};

google.maps.Marker.prototype._setMap = google.maps.Marker.prototype.setMap;

google.maps.Marker.prototype.setMap = function(map) {
    if (map) {
        map.markers[map.markers.length] = this;
    }
    this._setMap(map);
}
