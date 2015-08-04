// TODO fix the file name hack - introduce load order to modules.
var Utils = (function() {
  var utils = {};

  if (!Array.prototype.clone) {
    // from http://blog.andrewray.me/how-to-clone-a-nested-array-in-javascript/
    var arrayClone = function(arr) {
      var i, copy;

      if (Array.isArray(arr)) {
        copy = arr.slice(0);
        for(i = 0; i < copy.length; i++) {
            copy[i] = arrayClone(copy[i]);
        }
        return copy;
      } else if (typeof arr === 'object') {
        throw 'Cannot clone array containing an object!';
      } else {
        return arr;
      }
    }; 

    Array.prototype.clone = function() {
      return arrayClone(this);
    }
  }

  if (!Array.prototype.isEqualTo) {
    // from http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
    // attach the .isEqualTo method to Array's prototype to call it on any array
    Array.prototype.isEqualTo = function (array) {
      // if the other array is a falsy value, return
      if (!array) {
        return false;  
      }

      // compare lengths - can save a lot of time 
      if (this.length != array.length) {
        return false;  
      }

      for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].isEqualTo(array[i])) {
            return false;       
          }
        }           
        else if (this[i] != array[i]) { 
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;   
        }           
      }       
      return true;
    }; 
  }

  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  if (!Array.prototype.includes) {
    Array.prototype.includes = function(element) {
      for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] === element) {
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