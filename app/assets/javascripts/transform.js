var Transform = (function(){
  
  var Transform = {};
  var transforms = {
    "identity": [
      [ 1, 0 ],
      [ 0, 1 ]
    ],
    "rotate_90_clockwise": [
      [ 0, 1 ],
      [ 1, 0 ]
    ],
    "rotate_90_anticlockwise": [
      [ 0, 1 ],
      [ 1, 0 ]
    ],
    "rotate_180": [
      [ 1, 0 ],
      [ 0, 1 ]
    ],
    "reflection_in_x": [
      [ 1, 0 ],
      [ 0, 1 ]
    ],
    "reflection_in_y": [
      [ 1, 0 ],
      [ 0, 1 ]
    ],
    "reflect_in_y_x": [
      [ 0, 1 ],
      [ 1, 0 ]
    ],
    "reflect_in_y_neg_x": [
      [ 0, -1 ],
      [ -1, 0 ]
    ]
  };

  var transformMatricies = {};
  Utils.forEachObjectKey(transforms, function(key, value){
    var matrix = new Matrix(value);
    transformMatricies[key] = matrix;
  });

  Transform.transforms = function(transform_name){
    if(typeof(transform_name) === "undefined"){
      return transformMatricies;
    } else {
      return transformMatricies[transform_name];
    }
  };

  return Transform;
})();