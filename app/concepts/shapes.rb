class Shapes
	# TODO merge this into Shape?
	def self.names
		SHAPES.keys.sort!
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
			Shape.new(:Z4, Matrix[[0, 0, 1, 1], [0, 1, 1, 2]]),
			Shape.new(:Z5, Matrix[[0, 1, 1, 1, 2], [0, 0, 1, 2, 2]]),
			Shape.new(:N, Matrix[[0, 0, 1, 1, 1], [0, 1, 1, 2, 3]]),
			Shape.new(:W, Matrix[[0, 1, 1, 2, 2], [0, 0, 1, 1, 2]]),
			Shape.new(:X, Matrix[[0, 1, 1, 2, 1], [1, 0, 1, 1, 2]]),
			Shape.new(:O, Matrix[[0, 0, 1, 1],[0, 1, 1, 0]]),
			Shape.new(:_1, Matrix[[0],[0]]),
			Shape.new(:_2, Matrix[[0, 0],[0, 1]]),
			Shape.new(:I3, Matrix[[0, 0, 0],[0, 1, 2]]),
			Shape.new(:I4, Matrix[[0, 0, 0, 0],[0, 1, 2, 3]]),
			Shape.new(:I5, Matrix[[0, 0, 0, 0, 0],[0, 1, 2, 3, 4]]),
			Shape.new(:V5, Matrix[[0, 0, 0, 1, 2],[0, 1, 2, 2, 2]]),
			Shape.new(:V3, Matrix[[0, 0, 1],[0, 1, 1]]),
			Shape.new(:L5, Matrix[[0, 1, 0, 0, 0],[0, 0, 1, 2, 3]]),
			Shape.new(:L4, Matrix[[0, 1, 0, 0],[0, 0, 1, 2]]),
			Shape.new(:U, Matrix[[0, 1, 2, 0, 2],[0, 0, 0, 1, 1]]),
			Shape.new(:T4, Matrix[[1, 0, 1, 2],[0, 1, 1, 1]]),
			Shape.new(:T5, Matrix[[1, 1, 0, 1, 2],[0, 1, 2, 2, 2]]),
			Shape.new(:F, Matrix[[1, 1, 2, 0, 1],[0, 1, 1, 2, 2]]),
			Shape.new(:P, Matrix[[0, 1, 0, 1, 0],[0, 0, 1, 1, 2]]),
			Shape.new(:Y, Matrix[[0, 0, 0, 1, 0],[0, 1, 2, 2, 3]])
		]

		shapes_hash = shapes.inject({}) { |hash, shape| hash[shape.name] = shape; hash }
	end

	SHAPES = build_shapes_hash
end