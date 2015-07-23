var Render = (function(){
	var render = {};
  var SCALE = 30;
  var SVG_NS = "http://www.w3.org/2000/svg";

  render.board = function(board){
  	var boardContainer = document.getElementById("board");

    var squaresContainer = document.createElement("div");
    squaresContainer.setAttribute("class", "squares");

    board.forEachRow(function(row){
      var squareRowContainer = document.createElement("div");
      squareRowContainer.setAttribute("class", "square-row");

      row.forEach(function(square){
        var square = render.boardSquare(square);
        squareRowContainer.appendChild(square);
      });

      squaresContainer.appendChild(squareRowContainer);
    });

    boardContainer.appendChild(squaresContainer);
  };

  render.boardSquare = function(colour){
  	var svg = document.createElementNS(SVG_NS, "svg");
    
    var svgRect = document.createElementNS(SVG_NS, "rect");
    svgRect.setAttribute("width", SCALE);
    svgRect.setAttribute("height", SCALE);
    svg.appendChild(svgRect);

    var svgDiv = document.createElement("div");
    var classString = "square";
    if(colour !== "") {
      classString += " block-"+colour;
    }
    svgDiv.setAttribute("class", classString);
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
    svgDiv.appendChild(svg);

    return svgDiv;
  }

  render.shape = function(shape, colour) {
    var shapeContainer = document.createElement("div");
    shapeContainer.setAttribute("class", "shape");

    var titleContainer = document.createElement("div");
    var title = document.createElement("h3");
    title.appendChild(document.createTextNode(shape.shapeName()));
    titleContainer.appendChild(title);
    shapeContainer.appendChild(titleContainer);

    var isomersContainer = document.createElement("div");
    isomersContainer.setAttribute("class", "isomers");
    shapeContainer.appendChild(isomersContainer);

    var isomers = shape.isomers();
    for(var i = 0; i < isomers.length; i++){
      var isomer = render.isomer(isomers[i], colour);
      isomersContainer.appendChild(isomer);
    }

    return shapeContainer;
  };
  
  render.playerPieces = function(container, colour) {
    var shapes = Shape.shapes();
    Utils.forEachKeyValue(shapes, function(key, shape){
      var shapeContainer = render.shape(shape, colour);
      container.appendChild(shapeContainer);
    });
  };

	return render;
})();