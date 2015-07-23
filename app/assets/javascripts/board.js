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