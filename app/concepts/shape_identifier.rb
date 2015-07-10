require 'matrix'
require 'set'

class ShapeIdentifier

	def self.identify(shape_definition)
		coordinates_of_shape_at_origin = coordinate_set(move_to_origin(shape_definition))

		Shapes.shapes.find_all { |shape| shape.size == shape_definition.column_count }.each do |known_shape|
			return known_shape.name if has_transform_that_matches?(known_shape, coordinates_of_shape_at_origin)
		end

		return nil
	end

	private

	def self.has_transform_that_matches?(known_shape, unknown_shape_coordinates)
		TRANSFORMS.each do |name, transform|
			transformed_shape_at_origin = move_to_origin(transform * known_shape.definition)
			transformed_shape_at_origin_coordinates = coordinate_set(transformed_shape_at_origin)

			return true if unknown_shape_coordinates == transformed_shape_at_origin_coordinates
		end

		return false
	end

	def self.coordinate_set(shape_definition)
		coordinate_set = Set.new

		shape_definition.column_count.times do |index|
			x, y = shape_definition[0, index], shape_definition[1, index]
			coordinate_set.add(Point.new(x, y))
		end

		coordinate_set
	end

	def self.move_to_origin(shape_definition)
		min_x = shape_definition.row(0).to_a.min
		min_y = shape_definition.row(1).to_a.min

		Matrix.build(shape_definition.row_count, shape_definition.column_count) do |row, col|
			origin_offset = row == 0 ? min_x : min_y
			shape_definition[row, col] - origin_offset
		end
	end

	TRANSFORMS = {
		:rotate_90_c => Matrix[[0, 1], [-1, 0]],
		:rotate_90_ac => Matrix[[0, -1], [1, 0]],
		:rotate_180 => Matrix[[-1, 0], [0, -1]],
		:reflect_x => Matrix[[1, 0], [0, -1]],
		:reflect_y => Matrix[[-1, 0], [0, 1]],
		:identity => Matrix[[1,0],[0, 1]],
		:reflect_y_x => Matrix[[0, 1], [1, 0]],
		:reflect_y_negative_x => Matrix[[0, -1], [-1, 0]]
	}
end