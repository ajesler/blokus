// TODO fix the file name hack - introduce load order to modules.
var Utils = (function(){
  var utils = {};

  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  utils.containsElement = function(array, element){
    for(var i = array.length - 1; i >= 0; i--){
      if(array[i] === element){
        return true;
      }
    }
    return false;
  }

  utils.removeElement = function(array, element){
    for(var i = array.length - 1; i >= 0; i--){
      if(array[i] === element){
        array.remove(i);
        break;
      }
    }
  }

  utils.forEachKeyValue = function(object, callback) {
    var callbackWithContext = callback.bind(this);

    for(var property in object){
      if(object.hasOwnProperty(property)){
        var value = object[property];
        callbackWithContext(property, value);
      }
    }
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

// ajLand = (function() {
//   var modules = {}
//   var queuedModules = {}

//   var require = function() {
//     var max = arguments.length - 1
//     var callback = arguments[max]
//     var requires = arguments.slice(0, max - 1)
//   }

//   var declare = function(name, definition) {
//     modules[name] = definition
//     if queuedModules[name]
//   }

//   return {
//     ajModule: require,
//     ajRequire: declare,
//   }
// })()


// ajLand.require("utils", "matrix", function(utils, matrix) {

// })

// ajLand.declare("utils", function() {
//   return {} // stuff
// })