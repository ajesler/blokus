var Matrix = (function(){
  // from http://stackoverflow.com/questions/15313418/javascript-assert
  var assert = function(condition, message) { 
    if (!condition) {
      throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
    }
  };

  // from http://blog.andrewray.me/how-to-clone-a-nested-array-in-javascript/
  var arrayClone = function(arr) {
    var i, copy;

    if(Array.isArray(arr)) {
      copy = arr.slice(0);
      for(i = 0; i < copy.length; i++) {
          copy[i] = arrayClone(copy[i]);
      }
      return copy;
    } else if( typeof arr === 'object' ) {
      throw 'Cannot clone array containing an object!';
    } else {
      return arr;
    }
  };

  // from http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
  // attach the .isEqualTo method to Array's prototype to call it on any array
  Array.prototype.isEqualTo = function (array) {
    // if the other array is a falsy value, return
    if (!array) {
      return false;  
    }

    // compare lengths - can save a lot of time 
    if (this.length != array.length){
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

  var Matrix = function(rows, columns) {
    if(typeof(columns) === "undefined") {
      this.matrix = arrayClone(rows);
    } else {
      this.matrix = new Array(rows);
      for(var i = 0; i < rows; i++){
        this.matrix[i] = new Array(columns);
        for(var j = 0; j < columns; j++){
          this.matrix[i][j] = 0;
        }
      }
    }
  };

  Matrix.prototype.row_count = function() {
    return this.matrix.length;
  }

  Matrix.prototype.column_count = function() {
    return this.matrix[0].length;
  }

  Matrix.prototype.row = function(row){
    return this.matrix[row];
  };

  Matrix.prototype.column = function(column) {
    var result = new Array(this.row_count());

    for(var i = 0; i < this.row_count(); i++){
      result[i] = this.matrix[i][column];
    }

    return result;
  };

  Matrix.prototype.clone = function(){
    return new Matrix(this.matrix);
  };

  Matrix.prototype.isEqualTo = function(other_matrix){
    if(other_matrix instanceof Matrix){
      return this.matrix.isEqualTo(other_matrix.matrix);
    } else if (other_matrix instanceof Array) {
      return this.matrix.isEqualTo(other_matrix);
    } else {
      return false;
    }
  };

  Matrix.prototype.multiply = function(other_matrix) {
    assert(this.column_count() == other_matrix.row_count(), "matrix sizes are not compatible");

    var result = new Matrix(this.row_count(), other_matrix.column_count());

    this.matrix.forEach(function(row, row_index) {
      for(var column_index = 0; column_index < other_matrix.column_count(); column_index++) {

        column = other_matrix.column(column_index);

        var product = 0;

        column.forEach(function(element, index){
          product += element * row[index];
        });

        result.element(row_index, column_index, product);
      }
    });

    return result;
  };

  // TODO rename this
  Matrix.prototype.offset = function(offset_column){
    result = this.clone();

    this.matrix.forEach(function(row, row_index) {
      row.forEach(function(element, column_index) {
        var cell_value = element + offset_column[row_index];
        result.element(row_index, column_index, cell_value);
      });
    });

    return result;
  };

  Matrix.prototype.element = function(row, column, value) {
    assert(row < this.row_count(), "Row bounds exceeded");
    assert(column < this.column_count(), "Column bounds exceeded");

    if(typeof(value) === "undefined") {
      return this.matrix[row][column];
    } else {
      this.matrix[row][column] = value;
      return this;
    }
  };

  return Matrix;
})();