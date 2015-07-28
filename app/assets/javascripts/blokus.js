var Blokus = (function() {
  var RED = "red";
  var GREEN = "green";
  var BLUE = "blue";
  var YELLOW = "yellow";
  var PLAYER_COLOURS = [BLUE, YELLOW, RED, GREEN];
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

      blokus.buildBoard();
      blokus.renderBoard();
      blokus.renderPlayerPieces();
      blokus.initDragAndDrop();
    });
  }

  blokus.buildBoard = function() {
    board = new Board();

    gameData.turns.forEach(function(turn, index) {
      var colour = PLAYER_COLOURS[index % 4];

      var passed = turn.shape === null || turn.transform === null;
      if (!passed) {
        transform = Transform.transforms(turn.transform);
        shape = Shape.shapes(turn.shape);
        var positionedShape = shape.transform(transform, turn.x, turn.y);

        positionedShape.eachPoint(function(x, y){
          board.square(x, y, colour);
        });
      }
    });
  };

  var shapesUserHasPlayed = function(all_turns) {
    var usedShapes = all_turns.filter(function(turn, index){
      return PLAYER_COLOURS.indexOf(gameData.activeColour) == index % 4
    }).map(function(turn){
      return turn.shape;
    });

    return usedShapes;
  };

  blokus.renderPlayerPieces = function() {
    var piecesContainer = document.getElementById("pieces");

    var shapesUsed = shapesUserHasPlayed(gameData.turns);

    return Render.playerPieces(piecesContainer, gameData.isActivePlayer, gameData.activeColour, shapesUsed);
  };

  blokus.renderBoard = function(){
    Render.board(board);
  };

  var handleDragStart = function(e) {
    // this / e.target is the source node.

    dragSourceElement = this;

    e.dataTransfer.effectAllowed = 'move';
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
  var getXAndY = function(e) {
    var x = JSON.parse(e.getAttribute("data-x"));
    var y = JSON.parse(e.getAttribute("data-y"));

    return [x, y];
  }

  var getCoordinates = function(e) {
    return JSON.parse(e.getAttribute("data-coordinates"));
  }

  var getSquare = function(x, y) {
    return document.querySelector("[data-x='"+x+"'][data-y='"+y+"']");
  }

  var getPieceCoverage = function(e) {
    var square = e.target.parentNode.parentNode;

    var point = getXAndY(square);
    var coordinates = getCoordinates(dragSourceElement);
    var matrix = new Matrix(coordinates).offset(point);

    return matrix;
  }

  var highlightDropSquares = function() {
    if (pieceCoords !== null) {
      var messages = [];
      var validPlacement = board.isValidMove(pieceCoords, gameData.activeColour);
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

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSourceElement != this) {
      var coordinates = getPieceCoverage(e);
      
      if(board.isValidMove(coordinates, gameData.activeColour)){
        placePiece(coordinates);
        disableIsomerDragging();

        clearControls();
        createControls();
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

  var createButton = function(value) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = value;

    return button;
  };

  var resetButtonAction = function(){
    blokus.revertMove();
  }

  var saveButtonAction = function(){
    var formData = new FormData();

    for(var i = pieceCoords.columnCount() - 1; i >= 0; i--){
      var point = pieceCoords.column(i);
      formData.append("coordinates[]", point[0]+","+point[1]);
    }
    
    var url = "/games/"+gameID+"/turns";

    Utils.httpPost(url, formData, function(data){
      blokus.reload();
    });
  };

  var createControls = function(){
    var controls = document.getElementById("controls");

    var resetButton = createButton("reset");
    resetButton.onclick = resetButtonAction;

    var saveButton = createButton("save");
    saveButton.onclick = saveButtonAction;

    controls.appendChild(resetButton);
    controls.appendChild(saveButton);
  };

  var clearControls = function(){
    var controls = document.getElementById("controls");
    while (controls.firstChild){
      controls.removeChild(controls.firstChild);
    }
  };

  blokus.revertMove = function(){
    enableIsomerDragging();

    clearControls();

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