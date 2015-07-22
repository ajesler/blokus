#= require spec_helper

describe("Shape", function(){
  describe(".shapes", function(){
    it("should returns an object with shapes", function(){
      var cross_shape = new Shape([[1, 0, 1, 2, 1], [0, 1, 1, 1, 2]]);
      var shapes = Shape.prototype.shapes;
      expect(new Shape(shapes['X']).isEqualTo(cross_shape)).toBe(true);
    });
  });

  describe("#isomers", function(){
    it("returns the isomers of a shape", function(){
      var cross_shape = new Shape([[1, 0, 1, 2, 1], [0, 1, 1, 1, 2]]);
      var f_shape = new Shape([[1, 1, 2, 0, 1], [0, 1, 1, 2, 2]]);

      var isomers = cross_shape.isomers();
      expect(isomers.length).toBe(1);

      isomers = f_shape.isomers();
      expect(isomers.length).toBe(8);
    });
  });

  describe("#are_same_coordinates", function(){
    it("returns true if the coordinate sets are the same", function(){
      var shape_one = new Shape([[1,2,3],[4,5,6]]);
      var shape_two = new Shape([[3,2,1],[6,5,4]]);

      expect(shape_one.are_same_coordinates(shape_two)).toBe(true);
    });
  });

  describe("#to_origin", function(){
    it("moves the shape as close to the origin as possible", function(){
      var shape_one = new Shape([[-3, -2, -1, -3, -1], [-2, -2, -2, -1, -1]]);
      var shape_two = new Shape([[7, 8, 9, 7, 9], [4, 4, 4, 5, 5]]);
      var expected_result = new Shape([[0, 1, 2, 0, 2], [0, 0, 0, 1, 1]]);

      var result_one = shape_one.to_origin();
      var result_two = shape_two.to_origin();

      expect(expected_result.are_same_coordinates(result_one)).toBe(true);
      expect(expected_result.are_same_coordinates(result_two)).toBe(true);
    });
  });
});