var Blokus = (function() {
  var EMPTY = "";

  var blokus = {};

  var gameID = null;
  var gameData = null;
  var dragSourceElement = null;
  var board = null;

  var pieceCoords = null;

  blokus.init = function(gameid) {
    gameID = gameid;

    blokus.loadGame(gameID);
  };

  blokus.reload = function(){
    window.location.reload();
  };

  blokus.loadGame = function(id) {
    var gameURL = "/games/"+id+".json"
    Utils.getJSON(gameURL, function(data){
      gameData = data;

      board = new Board(gameData.board);

      blokus.renderBoard();

      if (gameData.finished) {
        Render.finished(gameData.scores, gameData.winningPlayerID);
      } else {
        blokus.initWebSockets();
        if (gameData.isActivePlayer) {
          blokus.renderPlayerPieces();
          blokus.renderControls();
          blokus.initDragAndDrop();
        }
      }
    });
  };

  blokus.renderPlayerPieces = function() {
    Render.playerPieces(gameData.activeColour, gameData.pieces);
  };

  blokus.renderBoard = function(){
    Render.board(board);
  };

  blokus.renderControls = function() {
    Render.passButton(gameID);
  };

  blokus.pieceCoordinates = function() {
    return pieceCoords;
  }

  blokus.initWebSockets = function() {
    // connect to server like normal
    var dispatcher = new WebSocketRails('localhost:3000/websocket');

    // subscribe to the channel
    var channel = dispatcher.subscribe('game_'+gameID);

    // bind to a channel event
    channel.bind('update', function(data) {
      console.log('channel event received: ' + data);
      if (data.updated) {
        Blokus.reload();
      }
    });
  }

  var handleDragStart = function(e) {
    // this / e.target is the source node.

    dragSourceElement = this;

    e.dataTransfer.effectAllowed = 'move';

    // hack to make firefox work
    e.dataTransfer.setData('text', 'foo');
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

    pieceCoords = getPieceCoverage(e);

    unhighlightDropSquares();
  };

  var handleDragLeave = function(e) {
    // this / e.target is previous target element.
    highlightDropSquares();
  };

  // rename function and change e -> element
  var squareCoordinates = function(e) {
    var x = JSON.parse(e.getAttribute("data-x"));
    var y = JSON.parse(e.getAttribute("data-y"));

    return [x, y];
  }

  var isomerCoordinates = function(e) {
    return JSON.parse(e.getAttribute("data-coordinates"));
  }

  var getSquare = function(x, y) {
    return document.querySelector("[data-x='"+x+"'][data-y='"+y+"']");
  }

  var getPieceCoverage = function(e) {
    var square = e.target.parentNode.parentNode;

    var point = squareCoordinates(square);
    var coordinates = isomerCoordinates(dragSourceElement);
    var matrix = new Matrix(coordinates).offset(point);

    return matrix;
  }

  var highlightDropSquares = function() {
    if (pieceCoords !== null) {
      var messages = [];
      var validPlacement = board.isValidMove(pieceCoords, gameData.activeColour, gameData.isFirstTurn);
      var highlightClass = validPlacement ? "over" : "invalid-placement";
      
      for (var i = pieceCoords.columnCount() - 1; i >= 0; i--){
        var point = pieceCoords.column(i);
        if (board.isOnBoard(point)) {
          var square = getSquare(point[0], point[1]);
          square.classList.add(highlightClass);
        }
      }
    }
  }

  var unhighlightDropSquares = function(){
    var over = document.querySelectorAll(".square[class*=over]");
    var invalid = document.querySelectorAll(".square[class*=invalid-placement]");

    for(var i = 0; i < over.length; i++){
      over[i].classList.remove("over");
    }

    for(var i = 0; i < invalid.length; i++){
      invalid[i].classList.remove("invalid-placement");
    }
  }

  var placePiece = function(){
    unhighlightDropSquares();

    for(var i = pieceCoords.columnCount() - 1; i >= 0; i--){
      var point = pieceCoords.column(i);
      var square = getSquare(point[0], point[1]);

      square.classList.add("wide-stroke", "block-"+gameData.activeColour);
      board.square(point[0], point[1], gameData.activeColour);
    }
  }

  var disableIsomerDragging = function(){
    var isomers = document.querySelectorAll(".isomers .isomer");
    for(var i = 0; i < isomers.length; i++){
      isomers[i].setAttribute("draggable", "false");
      isomers[i].style.cursor = "no-drop";
    }
  };

  var enableIsomerDragging = function(){
    var isomers = document.querySelectorAll(".isomers .isomer");
    for(var i = 0; i < isomers.length; i++){
      isomers[i].setAttribute("draggable", "true");
      isomers[i].style.cursor = "move";
    }
  }

  function handleDrop(e) {
    // this / e.target is current target element.

    e.preventDefault();

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSourceElement != this) {
      var coordinates = getPieceCoverage(e);
      
      if(board.isValidMove(coordinates, gameData.activeColour, gameData.isFirstTurn)){
        placePiece(coordinates);
        disableIsomerDragging();

        Render.clearPieceControls();
        Render.pieceControls(gameID);
      }
    }

    return false;
  };

  function handleDragEnd(e) {
    // this/e.target is the source node.
    unhighlightDropSquares();
  };

  blokus.initDragAndDrop = function(){
    var pieces = document.querySelectorAll('.isomers .isomer');
    for(var i = 0; i < pieces.length; i++){
      pieces[i].addEventListener('dragstart', handleDragStart, false);
      pieces[i].addEventListener('drop', handleDrop, false);
      pieces[i].addEventListener('dragend', handleDragEnd, false);
    }

    var squares = document.querySelectorAll('.squares .square');
    for(var i = 0; i < squares.length; i++){
      squares[i].addEventListener('drop', handleDrop, false);
      squares[i].addEventListener('dragenter', handleDragEnter, false);
      squares[i].addEventListener('dragover', handleDragOver, false);
      squares[i].addEventListener('dragleave', handleDragLeave, false);
      
    }
  };

  blokus.revertMove = function(){
    enableIsomerDragging();

    Render.clearPieceControls();

    for(var i = pieceCoords.columnCount() - 1; i >= 0; i--){
      var point = pieceCoords.column(i);
      var square = getSquare(point[0], point[1]);

      square.setAttribute("class", "square");
      board.square(point[0], point[1], EMPTY);
    }

    pieceCoords = null;
  };

  return blokus;
})();