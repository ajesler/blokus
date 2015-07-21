#= require spec_helper

describe("Blokus", function(){

  describe("Matrix", function() {

    describe(".column", function(){
      it("extracts the column from the matrix and returns an array", function(){
        matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        column = [2, 5, 8];

        expect(Blokus.Matrix.column(matrix, 1)).toEqual(column);
      });
    });

    describe(".new_matrix", function(){
      it("returns a new matrix of 0's", function(){
        expected = [ [0, 0], [0, 0], [0, 0] ]

        expect(Blokus.Matrix.new_matrix(3, 2)).toEqual(expected);
      });
    });

    describe(".multiply", function(){
      it("returns the multiplied matricies", function() {
        transform = [[1, 0], [0, 1]]
        shape = [[1,1,2,0,1],[0,1,1,2,2]]

        expect(Blokus.Matrix.multiply(transform, shape)).toEqual(shape);
      });

      it("throws an error when sizes are not compatible", function(){
        a = [[1, 2, 3], [1, 2, 3]];
        expect(function(){
          Blokus.Matrix.multiply(a, a);
        }).toThrow();
      });
    });

    describe('.offset', function() {
      it("applies an offset to a matrix", function() {
        matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        offset = [1, 2, 3]
        expected = [[2, 3, 4], [6, 7, 8], [10, 11, 12]];
        expect(Blokus.Matrix.offset(matrix, offset)).toEqual(expected);
      });
    });
  });

  describe("Shape", function(){
    describe(".are_same_coordinates", function(){
      it("returns true if the coordinate sets are the same", function(){
        shape_one = [[1,2,3],[4,5,6]];
        shape_two = [[3,2,1],[6,5,4]];

        expect(Blokus.Shape.are_same_coordinates(shape_one, shape_two)).toBe(true);
      });
    });

    describe(".to_origin", function(){
      it("moves the shape as close to the origin as possible", function(){
        shape_one = [[-3, -2, -1, -3, -1], [-2, -2, -2, -1, -1]];
        shape_two = [[7, 8, 9, 7, 9], [4, 4, 4, 5, 5]];
        expected_result = [[0, 1, 2, 0, 2], [0, 0, 0, 1, 1]];

        result_one = Blokus.Shape.to_origin(shape_one);
        result_two = Blokus.Shape.to_origin(shape_two);

        expect(Blokus.Shape.are_same_coordinates(result_one, expected_result)).toBe(true);
        expect(Blokus.Shape.are_same_coordinates(result_two, expected_result)).toBe(true);
      });
    });
  });
});