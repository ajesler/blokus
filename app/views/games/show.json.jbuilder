json.finished @presenter.finished
if @presenter.finished
	json.scores @presenter.scores.each do |player, score|
		json.id player.id
		json.name player.name
		json.score score
	end
	json.winningPlayerID @presenter.winner
end
json.activeColour @presenter.active_colour
json.isActivePlayer @presenter.is_active_player
if @presenter.is_active_player
  json.isFirstTurn @presenter.is_first_turn
end
json.pieces @presenter.available_shapes.each do |shape|
	json.id shape.name
	json.isomers shape.isomers
end
json.board @presenter.board