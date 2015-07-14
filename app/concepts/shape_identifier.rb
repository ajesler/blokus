require 'matrix'
require 'set'

class ShapeIdentifier

	def self.identify(shape_definition)
		coordinates_of_shape_at_origin = MatrixConversions.to_point_set(move_to_origin(shape_definition))

		Shapes.shapes.find_all { |shape| shape.size == shape_definition.column_count }.each do |known_shape|
			found_transform = find_transform_that_matches(known_shape, coordinates_of_shape_at_origin)

			if found_transform
				min_x, min_y = min_x_and_y(shape_definition)

				return ShapeIdentification.new(known_shape.name, found_transform, Point.new(min_x, min_y))
			end
		end

		return ShapeIdentification::NOT_IDENTIFIED
	end

	private

	def self.find_transform_that_matches(known_shape, unknown_shape_coordinates)
		Transforms.transforms.each do |transform|
			transformed_shape_at_origin = move_to_origin(transform.definition * known_shape.definition)
			transformed_shape_at_origin_coordinates = MatrixConversions.to_point_set(transformed_shape_at_origin)

			return transform.name if unknown_shape_coordinates == transformed_shape_at_origin_coordinates
		end

		return nil
	end

	def self.min_x_and_y(shape_definition)
		min_x = shape_definition.row(0).to_a.min
		min_y = shape_definition.row(1).to_a.min
		return min_x, min_y
	end

	def self.move_to_origin(shape_definition)
		min_x, min_y = min_x_and_y(shape_definition)

		Matrix.build(shape_definition.row_count, shape_definition.column_count) do |row, col|
			origin_offset = row == 0 ? min_x : min_y
			shape_definition[row, col] - origin_offset
		end
	end
end