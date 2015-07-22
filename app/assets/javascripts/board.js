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
      // get value
      this.board[y][x];
    } else {
      this.board[y][x] = value;
      return this;
    }
  };

  Board.prototype.forEachSquare = function(callback) {
    var context = this;
    this.board.forEach(function(row, y){
      row.forEach(function(square, x){
        var value = context.square(x, y);
        callback.call(context, x, y, value);
      });
    });
  };

  return Board;
})();