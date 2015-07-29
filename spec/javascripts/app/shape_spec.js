#= require spec_helper

describe("Shape", function(){
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

  describe("#hasSameCoordinates", function(){
    it("returns true if the coordinate sets are the same", function(){
      var shape_one = new Shape([[1,2,3],[4,5,6]]);
      var shape_two = new Shape([[3,2,1],[6,5,4]]);

      expect(shape_one.hasSameCoordinates(shape_two)).toBe(true);
    });
  });

  describe("#moveToOrigin", function(){
    it("moves the shape as close to the origin as possible", function(){
      var shape_one = new Shape([[-3, -2, -1, -3, -1], [-2, -2, -2, -1, -1]]);
      var shape_two = new Shape([[7, 8, 9, 7, 9], [4, 4, 4, 5, 5]]);
      var expected_result = new Shape([[0, 1, 2, 0, 2], [0, 0, 0, 1, 1]]);

      var result_one = shape_one.moveToOrigin();
      var result_two = shape_two.moveToOrigin();

      expect(expected_result.hasSameCoordinates(result_one)).toBe(true);
      expect(expected_result.hasSameCoordinates(result_two)).toBe(true);
    });
  });
});