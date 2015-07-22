var Utils = (function(){
  var utils = {};

  utils.forEachObjectKey = function(context, object, callback_function) {
    for(var property in object){
      if(object.hasOwnProperty(property)){
        var value = object[property];
        callback_function(context, property, value);
      }
    }
  };

  return utils;
})();