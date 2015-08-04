var Matrix = (function() {
  // from http://stackoverflow.com/questions/15313418/javascript-assert
  var assert = function(condition, message) { 
    if (!condition) {
      throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
    }
  }; 

  var Matrix = function(rows, columns) {
    if (typeof(columns) === "undefined") {
      this.matrix = rows.clone();
    } else {
      this.matrix = new Array(rows);
      for(var i = 0; i < rows; i++) {
        this.matrix[i] = new Array(columns);
        for(var j = 0; j < columns; j++) {
          this.matrix[i][j] = 0;
        }
      }
    }
  };

  Matrix.prototype.toArray = function() {
    return this.matrix.clone();
  };

  Matrix.prototype.rowCount = function() {
    return this.matrix.length;
  }

  Matrix.prototype.columnCount = function() {
    return this.matrix[0].length;
  }

  Matrix.prototype.row = function(row) {
    return this.matrix[row];
  };

  Matrix.prototype.column = function(column) {
    var result = new Array(this.rowCount());

    for(var i = 0; i < this.rowCount(); i++) {
      result[i] = this.matrix[i][column];
    }

    return result;
  };

  Matrix.prototype.columns = function() {
    var columns = [];

    for(var i = 0; i < this.columnCount(); i++) {
      columns.push(this.column(i));
    }

    return columns;
  };

  Matrix.prototype.rows = function() {
    return this.matrix.clone();
  };

  Matrix.prototype.clone = function() {
    return new Matrix(this.matrix);
  };

  Matrix.prototype.isEqualTo = function(other_matrix) {
    if (other_matrix instanceof Matrix) {
      return this.matrix.isEqualTo(other_matrix.matrix);
    } else if (other_matrix instanceof Array) {
      return this.matrix.isEqualTo(other_matrix);
    } else {
      return false;
    }
  };

  Matrix.prototype.multiply = function(other_matrix) {
    assert(this.columnCount() == other_matrix.rowCount(), "matrix sizes are not compatible");

    var result = new Matrix(this.rowCount(), other_matrix.columnCount());

    this.matrix.forEach(function(row, row_index) {
      for(var column_index = 0; column_index < other_matrix.columnCount(); column_index++) {
        column = other_matrix.column(column_index);

        var product = 0;
        column.forEach(function(element, index) {
          product += element * row[index];
        });
        result.element(row_index, column_index, product);
      }
    });

    return result;
  };

  Matrix.prototype.offset = function(offset_column) {
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
    assert(row < this.rowCount(), "Row bounds exceeded");
    assert(column < this.columnCount(), "Column bounds exceeded");

    if (typeof(value) === "undefined") {
      return this.matrix[row][column];
    } else {
      this.matrix[row][column] = value;
      return this;
    }
  };

  return Matrix;
})();