var Board = (function(){
  var BLANK = "";

  var Board = function(size){
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
  };

  Board.prototype.square = function(x, y, value){
    if(typeof(value) === "undefined") {
      return this.board[y][x];
    } else {
      this.board[y][x] = value;
      return this;
    }
  };

  var contains = function(list, element){
    for(var i = list.length - 1; i >= 0; i--){
      if(list[i] === element){
        return true;
      }
    }
    return false;
  }

  var pointOnBoard = function(x, y){
    if(typeof(y) === "undefined" && x instanceof Array && x.length == 2){
      y = x[1];
      x = x[0];
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
    var allOnBoard = coordinates.columns().reduce(function(validity, currentValue){
      var isValid = pointOnBoard(currentValue[0], currentValue[1]);
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
    return squares.filter(function(square){
      return pointOnBoard(square);
    });
  };

  var adjacentSquares = function(x, y){
    return offsetSquares(x, y, [[0, 1], [1, 0], [0, -1], [-1, 0]]);
  }

  var adjacentCorners = function(x, y){
    return offsetSquares(x, y, [[1, 1], [-1, 1], [1, -1], [-1, -1]]);
  }

  var touchesACornerOfSameColour = function(coordinates){
    return true;
  };

  var doesNotTouchEdgesOfTheSameColour = function(coordinates){
    return true;
  }

  Board.prototype.validMove = function(coordinates, playerColour) {
    var isValid = allCoordinatesOnBoard(coordinates);
    isValid &= this.coordinatesAreAllEmpty(coordinates);
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