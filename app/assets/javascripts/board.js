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
      this.board[y][x];
    } else {
      this.board[y][x] = value;
      return this;
    }
  };

  Board.prototype.forEachRow = function(callback) {
    var boundCallback = callback.bind(this);

    this.board.reverse().forEach(function(row){
      boundCallback(row);
    });
  };

  Board.prototype.forEachSquare = function(callback) {
    var boundCallback = callback.bind(this);
    this.board.reverse().forEach(function(row, y){
      row.forEach(function(square_contents, x){
        boundCallback(x, y, square_contents);
      });
    });
  };

  return Board;
})();