var Shape = (function(){
    // from http://stackoverflow.com/questions/15313418/javascript-assert
  var assert = function(condition, message) { 
    if (!condition) {
      throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
    }
  };
  
  var to_string_pairs = function(matrix){
    pairs = [];

    for(var i = 0; i < matrix.columnCount(); i++) {
      pairs.push(matrix.element(0, i).toString()+","+matrix.element(1, i).toString());
    }

    return pairs;
  };

  var Shape = function(shape_definition, shapeName){
    if(shape_definition instanceof Array){
      assert(shape_definition.length == 2, "shape_definition must have exactly two rows");
      this.shape_definition = new Matrix(shape_definition);
    } else if(shape_definition instanceof Matrix) {
      assert(shape_definition.rowCount() == 2, "shape_definition must have exactly two rows");
      this.shape_definition = shape_definition; 
    } else {
      throw Error("shape_definition must be an Array or a Matrix");
    }

    if(typeof(shapeName) !== "undefined"){
      this.nameOfShape = shapeName;
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

  Shape.prototype.hasSameCoordinates = function(other_shape) {
    assert(this.shape_definition.rowCount() == 2 && other_shape.shape_definition.rowCount() == 2);

    if(!(other_shape instanceof Shape)){
      return false;
    }

    if(this.shape_definition.columnCount() != other_shape.shape_definition.columnCount()) {
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

  Shape.prototype.minInRow = function(row){
    return Math.min.apply(null, this.shape_definition.row(row));
  };

  Shape.prototype.isEqualTo = function(other_shape){
    if(!(other_shape instanceof Shape)){
      return false;
    }

    return this.hasSameCoordinates(other_shape);
  };

  Shape.prototype.moveToOrigin = function(){
    var min_x = this.minInRow(0);
    var min_y = this.minInRow(1);

    var result = new Matrix(this.shape_definition.rowCount(), this.shape_definition.columnCount());

    for(var i = 0; i < this.shape_definition.columnCount(); i++) {
      var x = this.shape_definition.element(0, i) - min_x; 
      var y = this.shape_definition.element(1, i) - min_y; 
      result.element(0, i, x);
      result.element(1, i, y);
    }

    return new Shape(result);
  };

  Shape.prototype.transform = function(transform, x, y) {
    if(typeof(x) === "undefined"){
      x = 0;
    }
    if(typeof(y) === "undefined"){
      y = 0;
    }

    var tmpShape = new Shape(transform.multiply(this.shape_definition)).moveToOrigin();
    var result = new Shape(this.shape_definition.offset([x, y]));
    return result;
  };

  Shape.prototype.eachPoint = function(callback) {
    var context = this;
    for (var i = this.shape_definition.columnCount() - 1; i >= 0; i--) {
      var point = this.shape_definition.column(i);
      callback.call(context, point[0], point[1]);
    };
  };

  Shape.prototype.svgRects = function(scale){
    var rects = [];
    var xmax = 0, ymax = 0;
    for(var i = 0; i < this.shape_definition.columnCount(); i++){
      var x = this.shape_definition.element(0, i);
      var y = this.shape_definition.element(1, i);
      var scaledX = x * scale;
      var scaledY = y * scale;

      xmax = Math.max(xmax, x);
      ymax = Math.max(ymax, y);

      rects.push({
        x: scaledX,
        y: scaledY,
        width: scale,
        height: scale
      });
    }

    return {
      rects: rects,
      width: (1+xmax)*scale,
      height: (1+ymax)*scale
    }
  };

  var containsIsomer = function(isomers, isomer) {
    var matching_isomers = isomers.filter(function(shape){
      return shape.hasSameCoordinates(isomer);
    });
    return matching_isomers.length > 0;
  };

  Shape.prototype.isomers = function() {
    var isomers = [];

    var shape = this;
    Utils.forEachObjectKey(Transform.transforms(), function(key, transform){
      // call with this?
      var transform_applied = transform.multiply(shape.shape_definition);
      var new_shape = new Shape(transform_applied);
      var result = new_shape.moveToOrigin();

      if(!containsIsomer(isomers, result)){
        isomers.push(result);
      }
    });

    return isomers;
  };

  // TODO How to load?
  var all_shapes = {"Z4":[[0,0,1,1],[0,1,1,2]],"Z5":[[0,1,1,1,2],[0,0,1,2,2]],"N":[[0,0,1,1,1],[0,1,1,2,3]],"W":[[0,1,1,2,2],[0,0,1,1,2]],"X":[[0,1,1,2,1],[1,0,1,1,2]],"O":[[0,0,1,1],[0,1,1,0]],"1":[[0],[0]],"2":[[0,0],[0,1]],"I3":[[0,0,0],[0,1,2]],"I4":[[0,0,0,0],[0,1,2,3]],"I5":[[0,0,0,0,0],[0,1,2,3,4]],"V5":[[0,0,0,1,2],[0,1,2,2,2]],"V3":[[0,0,1],[0,1,1]],"L5":[[0,1,0,0,0],[0,0,1,2,3]],"L4":[[0,1,0,0],[0,0,1,2]],"U":[[0,1,2,0,2],[0,0,0,1,1]],"T4":[[1,0,1,2],[0,1,1,1]],"T5":[[1,1,0,1,2],[0,1,2,2,2]],"F":[[1,1,2,0,1],[0,1,1,2,2]],"P":[[0,1,0,1,0],[0,0,1,1,2]],"Y":[[0,0,0,1,0],[0,1,2,2,3]]};

  var shapes = {};
  Utils.forEachObjectKey(all_shapes, function(key, value){
    var shape = new Shape(value);
    shape.shapeName(key);

    shapes[key] = shape;
  });

  Shape.shapes = function(shape_name){
    if(typeof(shape_name) === "undefined"){
      return shapes;
    } else {
      return shapes[shape_name];
    }
  };

  return Shape;
})();