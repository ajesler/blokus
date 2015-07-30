var Board = (function(){
  var BLANK = "";

  var Board = function(size){
    if(size instanceof Array){
      // creating a new board with a given grid
      var boardArray = size;
      this.size = boardArray.length;
      this.board = boardArray;
    } else {
      if(typeof(size) !== "undefined"){
        this.size = size;
      } else {
        this.size = 20;
      }

      this.board = new Array(this.size);
      for(var y = 0; y < this.size; y++){
        this.board[y] = new Array(this.size);
        for(var x = 0; x < this.size; x++){
          this.board[y][x] = BLANK;
        }
      }
    }
  };

  Board.prototype.square = function(x, y, value){
    if(typeof(value) === "undefined") {
      return this.board[y][x];
    } else {
      this.board[y][x] = value;
      return this;
    }
  };

  var pointOnBoard = function(x, y){
    if(typeof(y) === "undefined" && x instanceof Array && x.length == 2){
      y = x[1];
      x = x[0];
    }

    if (this.size === "undefined") {
      throw "undefined board size in board.pointOnBoard()";
    }

    if(x > this.size - 1) { 
      return false
    }
    if(y > this.size - 1){
      return false;
    }
    if(x < 0){
      return false;
    }
    if(y < 0){
      return false;
    }
    return true;
  }

  var allCoordinatesOnBoard = function(coordinates){
    var self = this;
    var allOnBoard = coordinates.columns().reduce(function(validity, currentValue){
      var isValid = pointOnBoard.call(self, currentValue[0], currentValue[1]);
      return validity && isValid;
    }, true);

    return allOnBoard;
  };

  var offsetSquares = function(x, y, offsets){
    var squares = [];

    offsets.forEach(function(point){
      var nx = x + point[0];
      var ny = y + point[1];
      squares.push([nx, ny]);
    });

    var self = this;
    var validSquares = squares.filter(function(square){
      return pointOnBoard.call(self, square);
    });
    return validSquares;
  };

  var adjacentSquares = function(x, y){
    return offsetSquares.call(this, x, y, [[0, 1], [1, 0], [0, -1], [-1, 0]]);
  }

  var adjacentCorners = function(x, y){
    return offsetSquares.call(this, x, y, [[1, 1], [-1, 1], [1, -1], [-1, -1]]);
  }

  var touchesACornerOfSameColour = function(coordinates, colour){
    var cornerCoords = [];
    var self = this;
    coordinates.columns().forEach(function(column, index){
      var corners = adjacentCorners.call(self, column[0], column[1]);

      corners.forEach(function(point){
        if(!Utils.containsElement(cornerCoords, point)){
          cornerCoords.push(point);
        }
      });
    });

    coordinates.columns().forEach(function(point){
      if(Utils.containsElement(cornerCoords, point)){
        Utils.removeElement(point);
      }
    });

    var board = this;
    return cornerCoords.map(function(point){
      return board.square(point[0], point[1]) === colour;
    }).some(function(result){
      return result == true
    });
  };

  var doesNotTouchEdgesOfTheSameColour = function(coordinates, colour){
    var adjacentCoords = [];

    var self = this;
    coordinates.columns().forEach(function(column){
      var adjacent = adjacentSquares.call(self, column[0], column[1]);

      adjacent.forEach(function(point){
        if(!Utils.containsElement(adjacentCoords, point)){
          adjacentCoords.push(point);
        }
      });
    });

    coordinates.columns().forEach(function(point){
      if(Utils.containsElement(adjacentCoords, point)){
        Utils.removeElement(point);
      }
    });

    var board = this;
    var touchesEdge = adjacentCoords.map(function(point){
      return board.square(point[0], point[1]) === colour;
    }).some(function(result){
      return result === true
    });

    return !touchesEdge;
  }

  var inBoardCorner = function(coordinates) {
    var max_index = this.size - 1
    var corners = [
      [0, 0],
      [0, max_index],
      [max_index, 0],
      [max_index, max_index]
    ]

    var isInBoardCorner = false;
    coordinates.columns().forEach(function(column){
      var coversCorner = corners
                          .map(function(cornerPoint){
                            var isCorner = cornerPoint[0] === column[0] && cornerPoint[1] === column[1];
                            return isCorner;                
                          }).some(function(element){
                            return element;
                          });
      if (coversCorner) {
        isInBoardCorner = true;
      }
    });

    return isInBoardCorner;
  };

  Board.prototype.isOnBoard = function(x, y) {
    return pointOnBoard.call(this, x, y);
  };

  Board.prototype.isValidMove = function(coordinates, playerColour, isFirstTurn) {
    var onBoard = allCoordinatesOnBoard.call(this, coordinates);
    if (!onBoard) {
      return false;
    }

    var areEmpty = this.coordinatesAreAllEmpty(coordinates);
    if (!areEmpty) {
      return false;
    }

    var isValid = false;
    if (isFirstTurn) {
      var coversABoardCorner = inBoardCorner.call(this, coordinates);
      isValid = onBoard && areEmpty && coversABoardCorner;
    } else {
      var touchesCornerOfSameColour = touchesACornerOfSameColour.call(this, coordinates, playerColour);
      var noSharedEdges = doesNotTouchEdgesOfTheSameColour.call(this, coordinates, playerColour);

      isValid = onBoard && areEmpty && touchesCornerOfSameColour && noSharedEdges;
    }
    return isValid;
  };

  Board.prototype.forEachRow = function(callback) {
    var boundCallback = callback.bind(this);

    var offset = this.size - 1;
    this.board.clone().reverse().forEach(function(row, index){
      boundCallback(row, offset - index);
    });
  };

  Board.prototype.forEachSquare = function(callback) {
    var boundCallback = callback.bind(this);
    this.board.forEach(function(row, y){
      row.forEach(function(square_contents, x){
        boundCallback(x, y, square_contents);
      });
    });
  };

  Board.prototype.coordinatesAreAllEmpty = function(coordinates) {
    if(coordinates instanceof Array){
      coordinates = new Matrix(coordinates);
    }

    var free = [];

    for(var i = coordinates.columnCount() - 1; i >= 0; i--){
      var point = coordinates.column(i);
      var x = point[0];
      var y = point[1];

      var isFree = this.square(x, y) === BLANK;
      free.push(isFree);
    }

    return free.every(function(square){ return square == true });
  };

  return Board;
})();