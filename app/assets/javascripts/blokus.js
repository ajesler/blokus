var Blokus = (function () {
  var RED = "red";
  var GREEN = "green";
  var BLUE = "blue";
  var YELLOW = "yellow";
  var PLAYER_COLOURS = [BLUE, YELLOW, RED, GREEN];
  var EMPTY = "";

  var blokus = {};

  var settings = null;
  var turns = null;
  var dragSourceElement = null;
  var board = null;

  var writeLog = function(message){
    document.getElementById("log").innerHTML = message;
  }

  var turnsLoadedCallback = function(turnsJSON){
    turns = turnsJSON;
    blokus.buildBoard();
    blokus.renderPlayerPieces();
    blokus.renderBoard();
    blokus.initDragAndDrop();
  }

  blokus.init = function(gameSettings){
    settings = gameSettings;

    blokus.loadTurns();
  }

  blokus.loadTurns = function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          responseJSON = JSON.parse(request.responseText);
          turnsLoadedCallback(responseJSON);
        } else {
          // TODO handle error
        }
      }
    };

    request.open("GET", settings.turnsURL, true);
    request.send(null);
  }

  blokus.buildBoard = function(){
    board = new Board();

    turns.forEach(function(turn, index){
      var colour = PLAYER_COLOURS[index % 4];

      transform = Transform.transforms(turn.transform);
      shape = Shape.shapes(turn.shape);
      var positionedShape = shape.transform(transform, turn.x, turn.y);

      positionedShape.eachPoint(function(x, y){
        board.square(x, y, colour);
      });
    });
  };

  blokus.renderPlayerPieces = function(){
    var piecesContainer = document.getElementById("pieces");
    return Render.playerPieces(piecesContainer, settings.playerColour);
  };

  blokus.renderBoard = function(){
    Render.board(board);
  };

  // http://www.html5rocks.com/en/tutorials/dnd/basics/
  var handleDragStart = function(e) {
    this.style.opacity = '0.4';  // this / e.target is the source node.

    dragSourceElement = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  };

  var handleDragOver = function(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
  };

  var handleDragEnter = function(e) {
    // this / e.target is the current hover target.

    var coordinates = getPieceCoverage(e);    
    highlightDropSquares(coordinates);
    console.log("handleDragEnter "+coordinates.matrix.join(", "));
  };

  var handleDragLeave = function(e) {
    // this.classList.remove('over');  // this / e.target is previous target element.
    var coordinates = getPieceCoverage(e);
    unhighlightDropSquares(coordinates);
    console.log("handleDragLeave "+coordinates.matrix.join(", "));
  };

  var getXAndY = function(e){
    var x = JSON.parse(e.getAttribute("data-x"));
    var y = JSON.parse(e.getAttribute("data-y"));

    return [x, y];
  }

  var getCoordinates = function(e){
    var coordinates = JSON.parse(e.getAttribute("data-coordinates"));

    return coordinates;
  }

  var getSquare = function(x, y){
    return document.querySelector("[data-x='"+x+"'][data-y='"+y+"']");
  }

  var getPieceCoverage = function(e){
    var square = e.target.parentNode.parentNode;

    var point = getXAndY(square);
    var coordinates = getCoordinates(dragSourceElement);
    var matrix = new Matrix(coordinates).offset(point);
    
    var messages = [];
    messages.push("               x,y = "+point);
    messages.push("isomer coordinates = "+coordinates.join(" | "));
    messages.push("    covered coords = "+matrix.matrix.join(" | "))
    writeLog(messages.join("<br />"));

    return matrix;
  }

  var incrementEnterCount = function(square){
    if(typeof(square.enterCount) !== "undefined") {
      square.enterCount += 1;
    } else {
      square.enterCount = 1;
    }
  }

  var decrementEnterCount = function(square){
    if(typeof(square.enterCount) !== "undefined") {
      square.enterCount -= 1;
    } else {
      square.enterCount = 0;
    }
  }

  var hasZeroEnterCount = function(square){
    if(typeof(square.enterCount) !== "undefined") {
      return square.enterCount == 0;
    } else {
      return false;
    }
  }

  var highlightDropSquares = function(matrix){
    var messages = [];
    var validPlacement = board.coordinatesAreAllEmpty(matrix);
    var highlightClass = validPlacement ? "over" : "invalid-placement";
    
    for(var i = matrix.columnCount() - 1; i >= 0; i--){
      var point = matrix.column(i);
      var square = getSquare(point[0], point[1]);
      incrementEnterCount(square);

      var log = point[0]+", "+point[1]+" has classes "+square.classList;
      messages.push(log);

      square.classList.add(highlightClass);
    }
    writeLog(messages.join("<br />"));
  }

  var unhighlightDropSquares = function(matrix){
    for(var i = matrix.columnCount() - 1; i >= 0; i--){
      var point = matrix.column(i);
      var square = getSquare(point[0], point[1]);
      decrementEnterCount(square);

      if(hasZeroEnterCount(square)){
        square.classList.remove("over");
        square.classList.remove("invalid-placement");
      }
    }
  }

  var placePiece = function(matrix){
    for(var i = matrix.columnCount() - 1; i >= 0; i--){
      var point = matrix.column(i);
      var square = getSquare(point[0], point[1]);
      decrementEnterCount(square);

      if(hasZeroEnterCount(square)){
        square.classList.remove("over");
        square.classList.remove("invalid-placement");
      }

      square.classList.add("wide-stroke", "block-"+settings.playerColour);
      board.square(point[0], point[1], settings.playerColour);
    }

    // delete the dragSourceElement
    dragSourceElement.remove();
    dragSourceElement = null;
    console.log("\typiece successfully placed!")
  }

  function handleDrop(e) {
    // this / e.target is current target element.

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSourceElement != this) {

      // if the target is a square, allow it
      var coordinates = getPieceCoverage(e);
      console.log("attempting to place shape at "+coordinates.matrix.join(" | "));
      if(board.coordinatesAreAllEmpty(coordinates)){
        placePiece(coordinates);
      } else {
        console.log("\tcannot place piece, not all coordinates are empty")
        for(var i = coordinates.columnCount() - 1; i >= 0; i--){
          var point = coordinates.column(i);
          var x = point[0];
          var y = point[1];
          if(board.square(x, y) !== EMPTY){
            console.log("Square at "+x+", "+y+" is not empty, contains "+board.square(x, y));
          }
        }
      }

      // Set the source column's HTML to the HTML of the column we dropped on.
      // dragSourceElement.innerHTML = this.innerHTML;
      // this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
  };

  function handleDragEnd(e) {
    // this/e.target is the source node.

    var pieces = document.querySelectorAll('.squares .square');
    [].forEach.call(pieces, function (piece) {
      piece.classList.remove('over');
      piece.classList.remove('invalid-placement');
    });
  };

  blokus.initDragAndDrop = function(){
    var pieces = document.querySelectorAll('.isomers .isomer');
    [].forEach.call(pieces, function(piece) {
      piece.addEventListener('dragstart', handleDragStart, false);
      piece.addEventListener('dragenter', handleDragEnter, false);
      piece.addEventListener('dragover', handleDragOver, false);
      piece.addEventListener('dragleave', handleDragLeave, false);
      piece.addEventListener('drop', handleDrop, false);
      piece.addEventListener('dragend', handleDragEnd, false);
    });

    var squares = document.querySelectorAll('.squares .square');
    [].forEach.call(squares, function(square){
      square.addEventListener('drop', handleDrop, false);
      square.addEventListener('dragenter', handleDragEnter, false);
      square.addEventListener('dragover', handleDragOver, false);
      square.addEventListener('dragleave', handleDragLeave, false);
    });

  };

  return blokus;
})();