var Blokus = (function() {
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

  var pieceCoords = null;

  var turnsLoadedCallback = function(turnsJSON) {
    turns = turnsJSON;
    blokus.buildBoard();
    blokus.renderPlayerPieces();
    blokus.renderBoard();
    blokus.initDragAndDrop();
  }

  blokus.init = function(gameSettings) {
    settings = gameSettings;

    blokus.loadTurns();
  };

  blokus.reload = function(){
    window.location.reload();
  };

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
  };

  blokus.buildBoard = function() {
    board = new Board();

    turns.forEach(function(turn, index) {
      var colour = PLAYER_COLOURS[index % 4];

      var passed = false; // TODO
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

  blokus.renderPlayerPieces = function() {
    var piecesContainer = document.getElementById("pieces");

    // TODO extract into function - eg shapesUserHasPlayed
    var usedShapes = turns.filter(function(turn, index){
      return PLAYER_COLOURS.indexOf(settings.activeColour) == index % 4
    }).map(function(turn){
      return turn.shape;
    });

    return Render.playerPieces(piecesContainer, settings.isPlayersTurn, settings.activeColour, usedShapes);
  };

  blokus.renderBoard = function(){
    Render.board(board);
  };

  // http://www.html5rocks.com/en/tutorials/dnd/basics/
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
  var getXAndY = function(e){
    var x = JSON.parse(e.getAttribute("data-x"));
    var y = JSON.parse(e.getAttribute("data-y"));

    return [x, y];
  }

  var getCoordinates = function(e){
    return JSON.parse(e.getAttribute("data-coordinates"));
  }

  var getSquare = function(x, y){
    return document.querySelector("[data-x='"+x+"'][data-y='"+y+"']");
  }

  var getPieceCoverage = function(e){
    var square = e.target.parentNode.parentNode;

    var point = getXAndY(square);
    var coordinates = getCoordinates(dragSourceElement);
    var matrix = new Matrix(coordinates).offset(point);

    return matrix;
  }

  var highlightDropSquares = function(){
    if(pieceCoords !== null){
      var messages = [];
      // TODO rename validMove -> isValidMove
      var validPlacement = board.validMove(pieceCoords, settings.activeColour);
      var highlightClass = validPlacement ? "over" : "invalid-placement";
      
      for(var i = pieceCoords.columnCount() - 1; i >= 0; i--){
        var point = pieceCoords.column(i);
        var square = getSquare(point[0], point[1]);

        square.classList.add(highlightClass);
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

      square.classList.add("wide-stroke", "block-"+settings.activeColour);
      board.square(point[0], point[1], settings.activeColour);
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
      
      if(board.validMove(coordinates, settings.activeColour)){
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
    // TODO remove the forEach hack
    var pieces = document.querySelectorAll('.isomers .isomer');
    [].forEach.call(pieces, function(piece) {
      piece.addEventListener('dragstart', handleDragStart, false);
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

    formData.append("player_id", settings.playerID);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function(event){
      blokus.reload();
    });
    // TODO handle xhr error

    xhr.open('POST', settings.turnsURL);
    // rename CSRF_TOKEN - not a constant
    var CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').attributes.content.value;
    xhr.setRequestHeader('X-CSRF-Token', CSRF_TOKEN);

    xhr.send(formData)
  };

  var createControls = function(){
    var controls = document.getElementById("controls");

    // reset button
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

    // revert the board square styling
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