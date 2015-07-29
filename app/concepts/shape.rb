require 'matrix'
require 'set'
require_relative 'transforms'

class Shape
	attr_reader :name, :definition

	def initialize(name, definition)
		@name = name
		@definition = definition
	end

	def size
		@definition.column_count
	end

  def isomers
    @isomers ||= calculate_isomers
  end

  private

  def calculate_isomers
    isomer_points = Transforms.transforms.each.with_object(Set.new) do |transform, isomers|
      isomer = transform.definition * self.definition

      isomer_at_origin = MatrixConversions.move_to_origin(isomer)
      point_set = MatrixConversions.to_point_set(isomer_at_origin)

      if !isomers.include?(point_set)
        isomers.add(point_set)
      end
    end

    isomer_points.each.with_object([]) do |points, matrix_array|
      matrix_array << MatrixConversions.from_point_set(points)
    end
  end
end