@shapes.each do |shape|
	json.set! shape.name, shape.definition
end