json.array! @turns.each do |turn|
	json.set! :player_id, turn.player.id
	json.extract! turn, :shape, :transform, :x, :y
end