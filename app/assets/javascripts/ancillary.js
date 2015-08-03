// TODO fix the file name hack - introduce load order to modules.
var Utils = (function(){
  var utils = {};

  if (!Array.prototype.find){
    Array.prototype.find = function(callback) {
      for (var i = 0; i < this.length; i++) {
        if(callback(this[i], i, this)){
          return this[i];
        }
      }
      return undefined;
    };
  };

  if (!Array.prototype.includes) {
    Array.prototype.includes = function(element) {
      for(var i = this.length - 1; i >= 0; i--){
      if(this[i] === element){
        return true;
      }
    }
    return false;
    }
  };

  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  utils.getJSON = function(url, success, failure) {
    var self = this;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        responseJSON = JSON.parse(request.responseText);
        if (request.status === 200) {
          success.call(self, responseJSON);
        } else {
          if (typeof(failure) !== "undefined") {
            failure.call(self, responseJSON)
          }
        }
      }
    };

    request.open("GET", url, true);
    request.send(null);
  }

  utils.httpPost = function(url, formData, success, failure) {
    var self = this;
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        responseJSON = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          success.call(self, responseJSON);
        } else {
          if(typeof(failure) !== "undefined"){
            failure.call(this, responseJSON);
          }
        }
      }
    };

    xhr.open('POST', url);
    var csrf_token = document.querySelector('meta[name="csrf-token"]').attributes.content.value;
    xhr.setRequestHeader('X-CSRF-Token', csrf_token);

    xhr.send(formData)
  }

  return utils;
})();