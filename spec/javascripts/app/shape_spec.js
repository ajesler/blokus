#= require spec_helper

describe("Shape", function(){
  describe(".shapes", function(){
    it("should returns an object with shapes", function(){
      var cross_shape = new Shape([[1, 0, 1, 2, 1], [0, 1, 1, 1, 2]]);
      var shapes = Shape.shapes();

      expect(Object.keys(shapes).length).toBe(21);
    });
  });

  describe("#name", function(){
    it("returns 'unknown' if the shape name has not been set", function(){
      var shape = new Shape([[1, 2], [3, 4]]);

      expect(shape.shapeName()).toEqual("unknown");
    });

    it("returns the shape name if set", function(){
      var shape = new Shape([[1, 2], [3, 4]], "not a piece");

      expect(shape.shapeName()).toEqual("not a piece");
    });
  });

  describe("#isomers", function(){
    it("returns the isomers of a shape", function(){
      var cross_shape = new Shape([[1, 0, 1, 2, 1], [0, 1, 1, 1, 2]]);
      var two_shape = new Shape([[0, 0], [0, 1]]);
      var f_shape = new Shape([[1, 1, 2, 0, 1], [0, 1, 1, 2, 2]]);

      var f_isomers = f_shape.isomers();
      expect(f_isomers.length).toBe(8);

      // var cross_isomers = cross_shape.isomers();
      // expect(cross_isomers.length).toBe(1);

      // var two_isomers = two_shape.isomers();
      // expect(two_isomers.length).toBe(2);
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