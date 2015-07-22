// svg shape drawing methods

// draw board from turn list

// draw available pieces and isomers sidebar

// drag and drop piece functionality

var Blokus = (function () {

  var blokus = {};
  var playerColour = "red";

  blokus.renderPlayerPieces = function(){
    var piecesContainer = document.getElementById("pieces");
    return Render.playerPieces(piecesContainer, playerColour);
  };

  return blokus;
})();