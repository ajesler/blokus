require 'matrix'

class Shape
	attr_reader :name, :definition

	def initialize(name, definition)
		@name = name
		@definition = definition
	end

	def size
		@definition.column_count
	end
end