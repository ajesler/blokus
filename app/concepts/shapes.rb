class Shapes
	# TODO merge this into Shape?
	def self.names
		SHAPES.keys
	end

	def self.shapes
		SHAPES.values
	end

	def self.[](name)
		SHAPES[name]
	end

	def self.identify(shape_definition)
		ShapeIdentifier.identify(shape_definition)
	end

	private

	def self.build_shapes_hash
		shapes = [
			Shape.new(:four_z, Matrix[[0, 0, 1, 1], [0, 1, 1, 2]]),
			Shape.new(:five_z, Matrix[[0, 1, 1, 1, 2], [0, 0, 1, 2, 2]]),
			Shape.new(:unbalanced_z, Matrix[[0, 0, 1, 1, 1], [0, 1, 1, 2, 3]]),
			Shape.new(:space_ship, Matrix[[0, 1, 1, 2, 2], [0, 0, 1, 1, 2]]),
			Shape.new(:cross, Matrix[[0, 1, 1, 2, 1], [1, 0, 1, 1, 2]]),
			Shape.new(:large_squaree, Matrix[[0, 0, 1, 1],[0, 1, 1, 0]]),
			Shape.new(:small_square, Matrix[[0],[0]]),
			Shape.new(:two_line, Matrix[[0, 0],[0, 1]]),
			Shape.new(:three_line, Matrix[[0, 0, 0],[0, 1, 2]]),
			Shape.new(:four_line, Matrix[[0, 0, 0, 0],[0, 1, 2, 3]]),
			Shape.new(:five_line, Matrix[[0, 0, 0, 0, 0],[0, 1, 2, 3, 4]]),
			Shape.new(:large_corner, Matrix[[0, 0, 0, 1, 2],[0, 1, 2, 2, 2]]),
			Shape.new(:small_corner, Matrix[[0, 0, 1],[0, 1, 1]]),
			Shape.new(:large_l, Matrix[[0, 1, 0, 0, 0],[0, 0, 1, 2, 3]]),
			Shape.new(:small_l, Matrix[[0, 1, 0, 0],[0, 0, 1, 2]]),
			Shape.new(:ewe, Matrix[[0, 1, 2, 0, 2],[0, 0, 0, 1, 1]]),
			Shape.new(:short_t, Matrix[[1, 0, 1, 2],[0, 1, 1, 1]]),
			Shape.new(:long_t, Matrix[[1, 1, 0, 1, 2],[0, 1, 2, 2, 2]]),
			Shape.new(:stylish, Matrix[[1, 1, 2, 0, 1],[0, 1, 1, 2, 2]]),
			Shape.new(:conjoined_squares, Matrix[[0, 1, 0, 1, 0],[0, 0, 1, 1, 2]]),
			Shape.new(:line_with_growth, Matrix[[0, 0, 0, 1, 0],[0, 1, 2, 2, 3]])
		]

		shapes_hash = shapes.inject({}) { |hash, shape| hash[shape.name] = shape; hash }
	end

	SHAPES = build_shapes_hash
end