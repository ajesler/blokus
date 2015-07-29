var Render = (function(){
	var render = {};
  var SCALE = 30;
  var SVG_NS = "http://www.w3.org/2000/svg";
  var BOARD_SIZE = 20;

  render.board = function(board){
  	var boardContainer = document.getElementById("board");

    var squaresContainer = document.createElement("div");
    squaresContainer.setAttribute("class", "squares");

    board.forEachRow(function(row, y){
      var squareRowContainer = document.createElement("div");
      squareRowContainer.setAttribute("class", "square-row");

      row.forEach(function(square, x){
        var square = render.boardSquare(x, y, square);
        squareRowContainer.appendChild(square);
      });

      squaresContainer.appendChild(squareRowContainer);
    });

    boardContainer.appendChild(squaresContainer);
  };

  render.boardSquare = function(x, y, colour){
  	var svg = document.createElementNS(SVG_NS, "svg");
    
    var svgRect = document.createElementNS(SVG_NS, "rect");
    svgRect.setAttribute("width", SCALE);
    svgRect.setAttribute("height", SCALE);
    svg.appendChild(svgRect);

    var svgDiv = document.createElement("div");
    var classString = "square";
    if(colour !== "") {
      classString += " wide-stroke block-"+colour;
    }

    svgDiv.setAttribute("class", classString);
    svgDiv.setAttribute("data-x", x);
    svgDiv.setAttribute("data-y", y);
    svgDiv.appendChild(svg);

    return svgDiv;
  }

  render.isomer = function(isomer, colour){
    var svg = document.createElementNS(SVG_NS, "svg");

    var svgData = isomer.svgRects(SCALE);
    svg.setAttribute("width", svgData.width);
    svg.setAttribute("height", svgData.height);

    svgData.rects.forEach(function(rect){
      var svgRect = document.createElementNS(SVG_NS, "rect");
      svgRect.setAttribute("x", rect.x);
      svgRect.setAttribute("y", rect.y);
      svgRect.setAttribute("width", rect.width);
      svgRect.setAttribute("height", rect.height);
      svg.appendChild(svgRect);
    });

    var svgDiv = document.createElement("div");
    svgDiv.setAttribute("draggable", "true");
    svgDiv.setAttribute("class", "isomer block-"+colour);

    var coordinates = JSON.stringify(isomer.definition());
    svgDiv.setAttribute("data-coordinates", coordinates);
    
    svgDiv.appendChild(svg);

    return svgDiv;
  }

  render.piece = function(name, isomers, colour) {
    var shapeContainer = document.createElement("div");
    shapeContainer.setAttribute("class", "shape");

    var titleContainer = document.createElement("div");
    var title = document.createElement("h3");
    title.appendChild(document.createTextNode(name));
    titleContainer.appendChild(title);
    shapeContainer.appendChild(titleContainer);

    var isomersContainer = document.createElement("div");
    isomersContainer.setAttribute("class", "isomers");
    shapeContainer.appendChild(isomersContainer);

    isomers.forEach(function(isomerDefinition){
      var isomer = new Shape(isomerDefinition);
      var renderedIsomer = render.isomer(isomer, colour);
      isomersContainer.appendChild(renderedIsomer);
    });

    return shapeContainer;
  }
  
  render.playerPieces = function(colour, pieces) {
    var piecesContainer = document.getElementById("pieces");

    pieces.forEach(function(piece){
      var renderedShape = render.piece(piece.id, piece.isomers, colour);
      piecesContainer.appendChild(renderedShape);
    });
  };

  render.createButton = function(value) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.setAttribute("id", value+"-button");

    return button;
  };

  var passButtonAction = function(gid) {
    return function() {
      var formData = new FormData();

      formData.append("coordinates[]", "");

      var url = "/games/"+gid+"/turns";

      Utils.httpPost(url, formData, function(data){
        Blokus.reload();
      });
    }
  };

  var resetButtonAction = function(){
    return function(){
      Blokus.revertMove();
    }
  }

  var saveButtonAction = function(gameID){
    return function(){
      var formData = new FormData();
      var pieceCoords = Blokus.pieceCoordinates();

      for(var i = pieceCoords.columnCount() - 1; i >= 0; i--){
        var point = pieceCoords.column(i);
        formData.append("coordinates[]", point[0]+","+point[1]);
      }

      var url = "/games/"+gameID+"/turns";

      Utils.httpPost(url, formData, function(data){
        Blokus.reload();
      });
    }
  };

  render.passButton = function(gameID) {
    var controls = document.getElementById("controls");
    var passButton = render.createButton("pass");
    passButton.onclick = passButtonAction(gameID);

    controls.appendChild(passButton);
  };

  render.pieceControls = function(gameID) {
    var controls = document.getElementById("controls");

    var resetButton = Render.createButton("reset");
    resetButton.onclick = resetButtonAction();

    var saveButton = Render.createButton("save");
    saveButton.onclick = saveButtonAction(gameID);

    controls.appendChild(resetButton);
    controls.appendChild(saveButton);
  };

  var deleteNode = function(node){
    node.parentNode.removeChild(node);
  }

  render.clearPieceControls = function(){
    var buttons = [
      document.getElementById("reset-button"),
      document.getElementById("save-button")
    ];

    buttons.forEach(function(button){
      if (button) {
        deleteNode(button);
      }
    });
  };

  return render;
})();