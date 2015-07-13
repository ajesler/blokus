json.array! @turns.each do |turn|
	json.extract! turn, :shape, :player, :transform, :x, :y
end