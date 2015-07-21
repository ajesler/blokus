// Matrix transform methods

// svg shape drawing methods

// draw board from turn list

// draw available pieces and isomers sidebar

// drag and drop piece functionality

var Blokus = (function () {
  var blokus = {};
  var Matrix = {};
  var Transform = {};
  var Shape = {};
  blokus.Matrix = Matrix;
  blokus.Shape = Shape;
  blokus.Transform = Transform;

  // from http://stackoverflow.com/questions/15313418/javascript-assert
  var assert = function(condition, message) { 
    if (!condition) {
      throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
    }
  };

  Matrix.column = function(matrix, column) {
    result = new Array(matrix.length);

    for(var i = 0; i < matrix.length; i++){
      result[i] = matrix[i][column];
    }

    return result;
  };

  Matrix.new_matrix = function(rows, columns) {
    var result = new Array(rows);
    for(var i = 0; i < rows; i++){
      result[i] = new Array(columns);
      for(var j = 0; j < columns; j++){
        result[i][j] = 0;
      }
    }
    return result;
  };

  Matrix.multiply = function(a, b) {
    a_rows = a.length
    a_cols = a[0].length
    b_rows = b.length
    b_cols = b[0].length

    assert(a_cols == b_rows, "matrix sizes are not compatible");

    var result = blokus.Matrix.new_matrix(a_rows, b_cols);

    a.forEach(function(row, y_index) {
      for(var col_index = 0; col_index < b_cols; col_index++) {

        col = blokus.Matrix.column(b, col_index);

        var product = 0;

        col.forEach(function(col_element, index){
          product += col_element * row[index];
        });

        result[y_index][col_index] = product;
      }
    });

    return result;
  };

  // TODO rename this function
  Matrix.offset = function(matrix, offset_column) {
    result = Matrix.new_matrix(matrix.length, matrix[0].length);

    matrix.forEach(function(element, row_index, row) {
      row.forEach(function(element, column_index) {
        result[row_index][column_index] = matrix[row_index][column_index] + offset_column[row_index];
      });
    });

    return result;
  };

  Shape.are_same_coordinates = function(shape_a, shape_b) {
    assert(shape_a.length == 2 && shape_b.length == 2);

    if(shape_a[0].length != shape_b[0].length) {
      return false;
    }

    var to_string_pairs = function(matrix){
      pairs = [];

      for(var i = 0; i < matrix[0].length; i++) {
        pairs.push(matrix[0][i].toString()+","+matrix[1][i].toString());
      }

      return pairs;
    };

    var a_pairs = to_string_pairs(shape_a).sort();
    var b_pairs = to_string_pairs(shape_b).sort();

    var comparisons = a_pairs.map(function(element, index){
      same = element == b_pairs[index];
      return same;
    });

    var are_same = comparisons.every(function(element){
      return element == true;
    });

    return are_same;
  };

  Shape.to_origin = function(shape){
    assert(shape.length == 2);
    
    var min_x = Math.min.apply(null, shape[0]);
    var min_y = Math.min.apply(null, shape[1]);

    var result = Matrix.new_matrix(shape.length, shape[0].length);

    for(var i = 0; i < shape[0].length; i++){
      result[0][i] = shape[0][i] - min_x; 
      result[1][i] = shape[1][i] - min_y; 
    }

    return result;
  };

  Transform.transforms = []; // how to load?

  Shape.shapes = []; // how to load?

  Shape.isomers = function(shape) {
    // for each transform, generate all the isomers.
  };

  return blokus;
}());