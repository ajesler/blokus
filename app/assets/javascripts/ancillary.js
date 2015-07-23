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