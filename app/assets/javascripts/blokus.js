var Blokus = (function () {
  var RED = "red";
  var GREEN = "green";
  var BLUE = "blue";
  var YELLOW = "yellow";
  var PLAYER_COLOURS = [BLUE, YELLOW, RED, GREEN];
  var BLANK = "";

  var blokus = {};

  var settings = null;
  var turns = null;
  var dragSourceElement = null;
  var board = null;

  var turnsLoadedCallback = function(turnsJSON){
    turns = turnsJSON;
    blokus.buildBoard();
    blokus.initDragAndDrop();
    blokus.renderPlayerPieces();
    blokus.renderBoard();
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
    this.classList.add('over');
  };

  var handleDragLeave = function(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
  };

  function handleDrop(e) {
    // this / e.target is current target element.

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSourceElement != this) {
      // Set the source column's HTML to the HTML of the column we dropped on.
      dragSourceElement.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
  };

  function handleDragEnd(e) {
    // this/e.target is the source node.

    var pieces = document.querySelectorAll('.isomers .isomer');
    [].forEach.call(pieces, function (piece) {
      piece.classList.remove('over');
    });
  };

  return blokus;
})();