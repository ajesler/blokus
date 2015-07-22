// svg shape drawing methods

// draw board from turn list

// draw available pieces and isomers sidebar

// drag and drop piece functionality

var Blokus = (function () {

  var blokus = {};

  blokus.renderIsomer = function(isomer){
    // create an svg element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "isomer");

    var ns = "";
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    var scale = 20;
    var rects = isomer.svgRects(scale);
    rects.forEach(function(rect){
      var svgRect = document.createElementNS(null, "rect");
      svgRect.setAttributeNS(null, "x", rect.x);
      svgRect.setAttributeNS(null, "y", rect.y);
      svgRect.setAttributeNS(null, "width", rect.width);
      svgRect.setAttributeNS(null, "height", rect.height);
      svgRect.setAttributeNS(null, "class", "block");

      svg.appendChild(svgRect);
    });

    var svgDiv = document.createElement("div");
    svgDiv.appendChild(svg);

    return svgDiv;
  }

  blokus.renderShape = function(shape) {
    // create a new div with a title
    var shapeContainer = document.createElement("div");
    shapeContainer.setAttribute("class", "shape");
    var title = document.createElement("h3");
    title.appendChild(document.createTextNode(shape.shapeName()));

    shapeContainer.appendChild(title);

    var isomers = shape.isomers();
    for(var i = 0; i < isomers.length; i++){
      // create an svg and render
      var isomer = blokus.renderIsomer(isomers[i]);
      shapeContainer.appendChild(isomer);
    }

    return shapeContainer;
  };

  blokus.renderPieces = function() {
    var pieces = document.getElementById("pieces");

    var shapes = Shape.shapes();
    for(var i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      var shapeContainer = blokus.renderShape(shape);
      pieces.appendChild(shapeContainer);
    };
  };

  return blokus;
})();