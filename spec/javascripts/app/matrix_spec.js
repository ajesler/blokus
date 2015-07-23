#= require spec_helper

describe("Matrix", function() {
  describe(".new", function(){
    it("returns a new matrix of 0's when given rows and columns argument", function(){
      var expected = [ [0, 0], [0, 0], [0, 0] ]

      expect(new Matrix(3, 2).isEqualTo(expected)).toBe(true);
    });

    it("returns a new matrix using the given array of rows when only the row argument is given", function(){
      var expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];

      expect(new Matrix(expected).isEqualTo(expected)).toBe(true);
    });
  });

  describe("#rowCount", function(){
    it("returns the number of rows in a matrix", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]);

      expect(matrix.rowCount()).toEqual(4);
    });
  });

  describe("#columnCount", function(){
    it("returns the number of columns in a matrix", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]);

      expect(matrix.columnCount()).toEqual(3);
    });
  });

  describe("#row", function(){
    it("extracts the row from the matrix and returns an array", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      var row = [7, 8, 9];

      expect(matrix.row(2)).toEqual(row);
    });
  });

  describe("#column", function(){
    it("extracts the column from the matrix and returns an array", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      var column = [2, 5, 8];

      expect(matrix.column(1)).toEqual(column);
    });
  });

  describe("#clone", function(){
    it("creates a new matrix that has the same elements", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      
      var clone = matrix.clone();

      expect(clone.isEqualTo(matrix)).toBe(true);
    });
  });

  describe("#equals", function() {
    it("works when given a matrix object", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      var other_matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      var yet_another_matrix = new Matrix([[1, 2, 3], [6, 5, 4], [7, 8, 9]]);

      expect(matrix.isEqualTo(other_matrix)).toBe(true);
      expect(matrix.isEqualTo(yet_another_matrix)).toBe(false);
    });

    it("works with nested arrays", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      var array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      var other_array = [[1, 2, 3], [6, 5, 4], [7, 8, 9]];

      expect(matrix.isEqualTo(array)).toBe(true);
      expect(matrix.isEqualTo(other_array)).toBe(false);
    });
  });

  describe("#multiply", function(){
    it("returns the multiplied matricies", function() {
      var transform = new Matrix([[1, 0], [0, 1]]);
      var shape = new Matrix([[1,1,2,0,1],[0,1,1,2,2]]);

      expect(transform.multiply(shape).isEqualTo(shape)).toBe(true);
    });

    it("throws an error when sizes are not compatible", function(){
      var a = new Matrix([[1, 2, 3], [1, 2, 3]]);

      expect(function(){
        a.multiply(a);
      }).toThrow();
    });
  });

  describe('#offset', function() {
    it("applies an offset to a matrix", function() {
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      var offset = [1, 2, 3];
      var expected = new Matrix([[2, 3, 4], [6, 7, 8], [10, 11, 12]]);

      expect(matrix.offset(offset).isEqualTo(expected)).toBe(true);
    });

    it("works when the offset is 0", function(){
      var matrix = new Matrix([[1, 2, 3, 0], [0, 5, 6, 4]]);
      var offset = [0, 0];

      expect(matrix.offset(offset).isEqualTo(matrix)).toBe(true);
    });
  });

  describe("#element", function(){
    it("returns the element at the given row and colum", function(){
      var matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

      expect(matrix.element(2, 2)).toBe(9);
    });

    it("sets the value of the element", function(){
      var matrix = new Matrix([[1, 2], [4, 5], [7, 8]]);
      matrix.element(2, 0, 43);

      var expected_matrix = new Matrix([[1, 2], [4, 5], [43, 8]]);

      expect(matrix.isEqualTo(expected_matrix)).toBe(true);
    });

    it("throws an error if column or row is outside the matrix bounds", function() {
      var matrix = new Matrix([[1, 2], [4, 5], [7, 8]]);
      
      expect(function(){
        matrix.element(3, 3);
      }).toThrow();
    });
  });
});