#= require spec_helper

describe("Board", function(){
  // 10x10
  var boardArray = [
    ["red","red","","","","","","","",""],
    ["","red","red","","","","","","",""],
    ["","","","","","blue","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","","green"],
    ["","","","","","","","","","green"],
    ["","","","","","","","","","green"]
  ];
  var board = new Board(boardArray);

  describe(".new", function(){
    it("has the expected size when given a board array to use", function(){
      expect(board.boardSize()).toEqual(10);
    });

    it("uses a default board size of 20", function(){
      var board = new Board();
      expect(board.boardSize()).toEqual(20);
    });

    it("creates a board based on the size parameter if it is given", function(){
      var board = new Board(15);
      expect(board.boardSize()).toEqual(15);
    });
  });

  describe("#square", function(){
    it("returns the contents of the square", function(){
      expect(board.square(9, 9)).toEqual("green");
      expect(board.square(2, 2)).toEqual("");
      expect(board.square(5, 2)).toEqual("blue");
    });
  });

  describe("#allSquaresOfColour", function(){
    it("returns the coordinates of all squares of a given colour", function(){
      var redSquares = board.allSquaresOfColour("red");
      expect(redSquares.length).toEqual(4);

      [[0, 0], [1, 0], [1, 1], [2, 1]].forEach(function(point){
        function pointsMatch(element, index, array) {
          var isMatch = element[0] === point[0] && element[1] === point[1];
          return isMatch;
        }
        var found = redSquares.find(pointsMatch);
        expect(found).toBeDefined();
      });
    });

    it("returns an empty array if there are no squares of the given colour", function(){
      expect(board.allSquaresOfColour("yellow")).toEqual([]);
    });
  });

  describe("#isAdjacentToColour", function(){
    it("is true if the given coordinate is next to a square of the same colour", function(){
      expect(board.isAdjacentToColour(1, 0, "red")).toBe(true);
    });

    it("is false if the given coordinate is not next to a square of the same colour", function(){
      expect(board.isAdjacentToColour(1, 0, "blue")).toBe(false);
    });
  });

  describe("#isABoardCorner", function(){
    it("returns true if a set of coordinates covers a board corner", function(){
      var matrix = new Matrix([[0, 1], [9, 9]]);

      expect(board.isABoardCorner(matrix)).toBe(true);
    });

    it("returns false if a set of coordinates does not cover a board corner", function(){
      var matrix = new Matrix([[3, 4], [5, 5]]);

      expect(board.isABoardCorner(matrix)).toBe(false);
    });
  });

  describe("#isOnBoard", function(){
    it("returns true if the coordinate is on the board", function(){
      expect(board.isOnBoard(1, 4)).toBe(true);
    });

    it("returns false if the coordinate is not on the board", function(){
      expect(board.isOnBoard(1, 11)).toBe(false);
    });
  });

  describe("#isEmpty", function(){
    it("returns true if the board square is empty", function(){
      expect(board.isEmpty(3, 3)).toBe(true);
    });

    it("returns false if the board square is not empty", function(){
      expect(board.isEmpty(0, 0)).toBe(false);
    });
  });

  describe("#forEachOpenCornerOfColour", function(){
    it("executes the callback", function(){
      var blueCount = 0;
      board.forEachOpenCornerOfColour("blue", function(){
        blueCount += 1;
      });

      expect(blueCount).toEqual(4);

      var greenCount = 0;
      board.forEachOpenCornerOfColour("green", function(){
        greenCount += 1;
      });

      expect(greenCount).toEqual(1);

      var yellowCount = 0;
      board.forEachOpenCornerOfColour("yellow", function(){
        yellowCount += 1;
      });

      expect(yellowCount).toEqual(0);

      var redCount = 0;
      board.forEachOpenCornerOfColour("red", function(){
        redCount += 1;
      });

      expect(redCount).toEqual(3);
    });
  });

  describe("#coordinatesAreAllEmpty", function(){
    it("is true if all of the coordinates are empty", function(){
      var coordinates = [[2, 3, 4], [0, 0, 0]];
      expect(board.coordinatesAreAllEmpty(coordinates)).toBe(true);
    });

    it("is false if not all of the coordinates are empty", function(){
      var coordinates = [[1, 2, 3], [0, 0, 0]];
      expect(board.coordinatesAreAllEmpty(coordinates)).toBe(false);
    });
  });
});