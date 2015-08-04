var Board = (function() {
  var EMPTY = "";

  var Board = function(size) {
    if (size instanceof Array) {
      var boardArray = size;
      this.size = boardArray.length;
      this.board = boardArray;
    } else {
      if (typeof(size) !== "undefined") {
        this.size = size;
      } else {
        this.size = 20;
      }

      this.board = new Array(this.size);
      for(var y = 0; y < this.size; y++) {
        this.board[y] = new Array(this.size);
        for(var x = 0; x < this.size; x++) {
          this.board[y][x] = EMPTY;
        }
      }
    }
  };

  Board.prototype.boardSize = function() {
    return this.size;
  };

  Board.prototype.square = function(x, y, value) {
    if (typeof(value) === "undefined") {
      return this.board[y][x];
    } else {
      this.board[y][x] = value;
      return this;
    }
  };

  Board.prototype.allCoordinatesValid = function(coordinates) {
    return coordinates.columns()
      .map(function(point) {
        return this.isOnBoard(point[0], point[1])
      }, this)
      .every(function(isValid) {
        return isValid;
      });
  };

  Board.prototype.adjacentTo = function(x, y) {
    return this.offsetSquares(x, y, [[0, 1], [1, 0], [0, -1], [-1, 0]]);
  };

  Board.prototype.adjacentCorners = function(x, y) {
    return this.offsetSquares(x, y, [[1, 1], [-1, 1], [1, -1], [-1, -1]]);
  };

  Board.prototype.offsetSquares = function(x, y, offsetPoints) {
    return offsetPoints
      .map(function(point) {
        return [point[0]+x, point[1]+y];
      }, this)
      .filter(function(point) {
        return this.isOnBoard(point[0], point[1]);
      }, this);
  };

  Board.prototype.hasAdjacentCornerOfColour = function(coordinates, colour) {
    return coordinates.columns()
      .map(function(column) {
        return this.adjacentCorners(column[0], column[1])
          .map(function(point) {
            return this.square(point[0], point[1]) === colour;
          }, this)
          .some(function(hasAdjacentCornerOfColour) {
            return hasAdjacentCornerOfColour;
          });
      }, this)
      .some(function(isAdjacent) {
        return isAdjacent;
      });
  };

  Board.prototype.doesNotTouchSameColourEdge = function(coordinates, colour) {
    return coordinates.columns()
      .map(function(column) {
        return this.adjacentTo(column[0], column[1])
          .map(function(point) {
            return this.square(point[0], point[1]) === colour;
          }, this)
          .every(function(hasAdjacent) {
            return !hasAdjacent;
          });
      }, this)
      .every(function(isNotAdjacent) {
        return isNotAdjacent;
      });
  };

  Board.prototype.isABoardCorner = function(coordinates) {
    var max_index = this.size - 1
    var corners = [
      [0, 0],
      [0, max_index],
      [max_index, 0],
      [max_index, max_index]
    ];

    return coordinates.columns()
      .map(function(column) {
        return corners.some(function(point) {
          return column[0] === point[0] && column[1] === point[1];
        })
      }, this)
      .some(function(coversACorner) {
        return coversACorner;
      });
  };

  Board.prototype.isOnBoard = function(x, y) {
    if (typeof(y) === "undefined" && x instanceof Array && x.length == 2) {
      y = x[1];
      x = x[0];
    }

    if (this.size === "undefined") {
      throw "undefined board size in board.isOnBoard()";
    }

    if (x > this.size - 1 || y > this.size - 1) {
      return false;
    }
    if (x < 0 || y < 0) {
      return false;
    }
    return true;
  };

  Board.prototype.isValidMove = function(coordinates, playerColour, isFirstTurn) {
    var onBoard = this.allCoordinatesValid(coordinates);
    if (!onBoard) {
      return false;
    }

    var areEmpty = this.coordinatesAreAllEmpty(coordinates);
    if (!areEmpty) {
      return false;
    }

    var isValid = false;
    if (isFirstTurn) {
      var coversABoardCorner = this.isABoardCorner(coordinates);
      isValid = onBoard && areEmpty && coversABoardCorner;
    } else {
      var touchesCornerOfSameColour = this.hasAdjacentCornerOfColour(coordinates, playerColour);
      var noSharedEdges = this.doesNotTouchSameColourEdge(coordinates, playerColour);

      isValid = onBoard && areEmpty && touchesCornerOfSameColour && noSharedEdges;
    }
    return isValid;
  };

  Board.prototype.forEachRow = function(callback) {
    var boundCallback = callback.bind(this);

    var offset = this.size - 1;
    this.board.clone().reverse().forEach(function(row, index) {
      boundCallback(row, offset - index);
    });
  };

  Board.prototype.forEachSquare = function(callback) {
    var boundCallback = callback.bind(this);
    this.board.forEach(function(row, y) {
      row.forEach(function(square_contents, x) {
        boundCallback(x, y, square_contents);
      });
    });
  };

  Board.prototype.allSquaresOfColour = function(colour) {
    var coords = [];

    this.forEachSquare(function(x, y, contents) {
      if (contents === colour) {
        coords.push([x, y]);
      }
    });

    return coords;
  };

  Board.prototype.isAdjacentToColour = function(x, y, colour) {
    var adjacent = this.adjacentTo(x, y)
      .map(function(point) {
        var isAdjacent = this.square(point[0], point[1]) === colour;
        return isAdjacent;
      }, this)
      .some(function(isAdjacent) {
        return isAdjacent;
      }, this);

    return adjacent;
  };

  Board.prototype.isEmpty = function(x, y) {
    return this.square(x, y) === EMPTY;
  };

  Board.prototype.forEachOpenCornerOfColour = function(colour, callback) {
    var isEmptySquare = function isEmptySquare(point) {
      return this.isEmpty(point[0], point[1]);
    }.bind(this);

    var isNotAdjacent = function isNotAdjacent(point) {
      return !this.isAdjacentToColour(point[0], point[1], colour);
    }.bind(this);

    var possibleSquares = [];
    this.allSquaresOfColour(colour).forEach(function(colourPoint) {
      this.adjacentCorners(colourPoint[0], colourPoint[1])
          .filter(isEmptySquare)
          .filter(isNotAdjacent)
          .forEach(function(point) {
            if (!possibleSquares.includes(point)) {
              possibleSquares.push(point);
            }
          }, this);
    }, this);

    possibleSquares
      .forEach(function(point) {
        callback(point[0], point[1]);
      }, this);
  };

  Board.prototype.coordinatesAreAllEmpty = function(coordinates) {
    if (coordinates instanceof Array) {
      coordinates = new Matrix(coordinates);
    }

    var isEmptySquare = function isEmptySquare(point) {
      return this.isEmpty(point[0], point[1]);
    }.bind(this);

    return coordinates.columns()
      .map(isEmptySquare)
      .every(function(isEmpty) {
        return isEmpty;
      });
  };

  return Board;
})();