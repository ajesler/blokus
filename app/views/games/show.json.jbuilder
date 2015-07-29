json.finished @presenter.finished
json.scores @presenter.scores
json.activeColour @presenter.active_colour
json.isActivePlayer @presenter.is_active_player
json.turns @presenter.turns, :shape, :transform, :x, :y
json.pieces @presenter.available_shapes.each do |shape|
	json.id shape.name
	json.isomers shape.isomers
end
json.board @presenter.board