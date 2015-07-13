@transforms.each do |transform|
	json.set! transform.name, transform.definition
end