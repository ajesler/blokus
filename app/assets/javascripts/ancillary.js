// TODO fix the file name hack - introduce load order to modules.
var Utils = (function(){
  var utils = {};

  utils.forEachObjectKey = function(object, callback) {
    var context = this;
    for(var property in object){
      if(object.hasOwnProperty(property)){
        var value = object[property];
        callback.call(context, property, value);
      }
    }
  };

  // TODO move assert into here.

  return utils;
})();