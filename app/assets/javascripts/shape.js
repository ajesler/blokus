var Shape = (function(){
    // from http://stackoverflow.com/questions/15313418/javascript-assert
  var assert = function(condition, message) { 
    if (!condition) {
      throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
    }
  };
  
  var to_string_pairs = function(matrix){
    pairs = [];

    for(var i = 0; i < matrix.column_count(); i++) {
      pairs.push(matrix.element(0, i).toString()+","+matrix.element(1, i).toString());
    }

    return pairs;
  };

  var Shape = function(shape_definition){
    if(shape_definition instanceof Array){
      assert(shape_definition.length == 2, "shape_definition must have exactly two rows");
      this.shape_definition = new Matrix(shape_definition);
    } else if(shape_definition instanceof Matrix) {
      assert(shape_definition.row_count() == 2, "shape_definition must have exactly two rows");
      this.shape_definition = shape_definition; 
    } else {
      throw Error("shape_definition must be an Array or a Matrix");
    }
  };

  Shape.prototype.shapeName = function(newName){
    if(typeof(newName) === "undefined"){
      return this.nameOfShape || "unknown";
    } else {
      this.nameOfShape = newName;
      return this;
    }
  };

  Shape.prototype.are_same_coordinates = function(other_shape) {
    assert(this.shape_definition.row_count() == 2 && other_shape.shape_definition.row_count() == 2);

    if(!(other_shape instanceof Shape)){
      return false;
    }

    if(this.shape_definition.column_count() != other_shape.shape_definition.column_count()) {
      return false;
    }

    var this_pairs = to_string_pairs(this.shape_definition).sort();
    var other_shape_pairs = to_string_pairs(other_shape.shape_definition).sort();

    var comparisons = this_pairs.map(function(element, index){
      same = element == other_shape_pairs[index];
      return same;
    });

    var are_same = comparisons.every(function(element){
      return element == true;
    });

    return are_same;
  };

  Shape.prototype.min_in_row = function(row){
    return Math.min.apply(null, this.shape_definition.row(row));
  };

  Shape.prototype.isEqualTo = function(other_shape){
    if(!(other_shape instanceof Shape)){
      return false;
    }

    return this.are_same_coordinates(other_shape);
  };

  Shape.prototype.to_origin = function(){
    var min_x = this.min_in_row(0);
    var min_y = this.min_in_row(1);

    var result = new Matrix(this.shape_definition.row_count(), this.shape_definition.column_count());

    for(var i = 0; i < this.shape_definition.column_count(); i++) {
      var x = this.shape_definition.element(0, i) - min_x; 
      var y = this.shape_definition.element(1, i) - min_y; 
      result.element(0, i, x);
      result.element(1, i, y);
    }

    return new Shape(result);
  };

  Shape.prototype.svgRects = function(scale){
    var rects = [];
    for(var i = 0; i < this.shape_definition.column_count(); i++){
      var x = this.shape_definition.element(0, i);
      var y = this.shape_definition.element(1, i);

      rects.push({
        x: x*scale,
        y: y*scale,
        width: scale,
        height: scale
      });
    }
    return rects;
  };

  var contains_isomer = function(isomers, isomer) {
    var matching_isomers = isomers.filter(function(shape){
      return shape.are_same_coordinates(isomer);
    });
    return matching_isomers.length > 0;
  };

  Shape.prototype.isomers = function() {
    var isomers = [];

    Utils.forEachObjectKey(this, Transform.transforms, function(context, key, value){
      var transform = new Matrix(value);
      var transform_applied = transform.multiply(context.shape_definition);
      var new_shape = new Shape(transform_applied);
      var result = new_shape.to_origin();

      if(!contains_isomer(isomers, result)){
        isomers.push(result);
      }
    });

    return isomers;
  };

  // How to load?
  var all_shapes = {"Z4":[[0,0,1,1],[0,1,1,2]],"Z5":[[0,1,1,1,2],[0,0,1,2,2]],"N":[[0,0,1,1,1],[0,1,1,2,3]],"W":[[0,1,1,2,2],[0,0,1,1,2]],"X":[[0,1,1,2,1],[1,0,1,1,2]],"O":[[0,0,1,1],[0,1,1,0]],"1":[[0],[0]],"2":[[0,0],[0,1]],"I3":[[0,0,0],[0,1,2]],"I4":[[0,0,0,0],[0,1,2,3]],"I5":[[0,0,0,0,0],[0,1,2,3,4]],"V5":[[0,0,0,1,2],[0,1,2,2,2]],"V3":[[0,0,1],[0,1,1]],"L5":[[0,1,0,0,0],[0,0,1,2,3]],"L4":[[0,1,0,0],[0,0,1,2]],"U":[[0,1,2,0,2],[0,0,0,1,1]],"T4":[[1,0,1,2],[0,1,1,1]],"T5":[[1,1,0,1,2],[0,1,2,2,2]],"F":[[1,1,2,0,1],[0,1,1,2,2]],"P":[[0,1,0,1,0],[0,0,1,1,2]],"Y":[[0,0,0,1,0],[0,1,2,2,3]]};
  Shape.shapes = function(){
    var shapes = [];
    Utils.forEachObjectKey(this, all_shapes, function(context, key, value){
      var shape = new Shape(value);
      shape.shapeName(key);
      shapes.push(shape);
    });
    return shapes;
  };

  return Shape;
})();