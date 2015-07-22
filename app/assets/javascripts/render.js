var Render = (function(){
	var render = {};
  var SCALE = 20;

  render.isomer = function(isomer, colour){
    // create an svg element
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");

    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    var svgData = isomer.svgRects(SCALE);
    svg.setAttribute("width", svgData.width);
    svg.setAttribute("height", svgData.height);

    svgData.rects.forEach(function(rect){
      var svgRect = document.createElementNS(NS, "rect");
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
    // create a new div with a title
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
      // create an svg and render
      var isomer = render.isomer(isomers[i], colour);
      isomersContainer.appendChild(isomer);
    }

    return shapeContainer;
  };
  
  render.playerPieces = function(container, colour) {
    var shapes = Shape.shapes();
    for(var i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      var shapeContainer = render.shape(shape, colour);
      container.appendChild(shapeContainer);
    };
  };

	return render;
})();