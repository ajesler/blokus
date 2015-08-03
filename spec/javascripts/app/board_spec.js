#= require spec_helper

describe("Board", function(){
  // 10x10
  var boardArray = [
    ["red","","","","","","","","",""],
    ["","","","","","","","","",""],
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
      expect(board.isEmpty(1, 1)).toBe(true);
    });

    it("returns false if the board square is not empty", function(){
      expect(board.isEmpty(0, 0)).toBe(false);
    });
  });
});