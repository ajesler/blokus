require 'pry'
require 'matrix'

class Matrix
  def []=(i, j, x)
    @rows[i][j] = x
  end

  def same(matrix)
  	self.coordinate_sort == matrix.coordinate_sort
  end

  def coordinate_sort
  	result = []

  	column_count.times do |index|
			col = column(index)
			x, y = col[0], col[1]
			result << [x, y]
		end

  	result.sort
  end
end

class Paper
	SHAPE_CHAR = "\u25FC"
	SHAPE_ORIGIN_CHAR = "\u25A3"
	ORIGIN_CHAR = "\u25A2"
	DEFAULT_DIMENSION = 11

	def initialize(matrix, title=nil, height=DEFAULT_DIMENSION, width=DEFAULT_DIMENSION)
		@matrix = matrix
		@title = title
		@height = height
		@width = width
	end

	def plot
		draw_matrix
		print
	end

	private

	def draw_matrix
		@paper = Matrix.build(@height, @width) { '.' }
		x_origin = (@width / 2)
		y_origin = (@height / 2)

		# assumes the input matix is 2xN
		@matrix.column_count.times do |index|
			col = @matrix.column(index)
			x, y = col[0], col[1]
			@paper[y_origin+y, x_origin+x] = SHAPE_CHAR
		end

		# set the origin marker
		origin_covered = @paper[x_origin, y_origin] == SHAPE_CHAR
		@paper[x_origin, y_origin] = origin_covered ? SHAPE_ORIGIN_CHAR : ORIGIN_CHAR
	end

	def print	
		puts
		puts "# #{@title}" if @title
		puts @matrix
		puts @paper.to_a.map { |row| row.join(' ') }
	end
end

class BlockDefinition < Struct.new(:name, :matrix)
	def dimensions
		r, c = matrix.row_count, matrix.column_count
		return r, c
	end

	def size
		matrix.column_count
	end
end

Transform = BlockDefinition
UserShape = BlockDefinition

def plot_transformed_block(transform, block)
	result = transform.matrix * block.matrix
	Paper.new(result, "#{transform.name} #{block.name}").plot
end

TRANSFORMS = {
	:rot_90_c => Transform.new("rotate 90 clockwise", Matrix[[0, 1], [-1, 0]]),
	:rot_90_ac => Transform.new("rotate 90 anticlockwise", Matrix[[0, -1], [1, 0]]),
	:rot_180 => Transform.new("rotate 180", Matrix[[-1, 0], [0, -1]]),
	:reflect_x => Transform.new("reflect on x axis", Matrix[[1, 0], [0, -1]]),
	:reflect_y => Transform.new("reflect on y axis", Matrix[[-1, 0], [0, 1]]),
	:identity => Transform.new("identity", Matrix[[1,0],[0, 1]]),
	:reflect_y_x => Transform.new("reflect_y_x", Matrix[[0, 1], [1, 0]]),
	:reflect_y_negative_x => Transform.new("reflect_y_negative_x", Matrix[[0, -1], [-1, 0]])
}

BLOCKS = {
	:four_z => BlockDefinition.new("four_z", Matrix[[0, 0, 1, 1], [0, 1, 1, 2]]),
	:five_z => BlockDefinition.new("five_z", Matrix[[0, 1, 1, 1, 2], [0, 0, 1, 2, 2]]),
	:unbalanced_z => BlockDefinition.new("unbalanced_z", Matrix[[0, 0, 1, 1, 1], [0, 1, 1, 2, 3]]),
	:space_ship => BlockDefinition.new("space_ship", Matrix[[0, 1, 1, 2, 2], [0, 0, 1, 1, 2]]),
	:cross => BlockDefinition.new("cross", Matrix[[0, 1, 1, 2, 1], [1, 0, 1, 1, 2]]),
	:large_square => BlockDefinition.new("large square", Matrix[[0, 0, 1, 1],[0, 1, 1, 0]]),
	:small_square => BlockDefinition.new("small square", Matrix[[0],[0]]),
	:two_line => BlockDefinition.new("two line", Matrix[[0, 0],[0, 1]]),
	:three_line => BlockDefinition.new("three line", Matrix[[0, 0, 0],[0, 1, 2]]),
	:four_line => BlockDefinition.new("four line", Matrix[[0, 0, 0, 0],[0, 1, 2, 3]]),
	:five_line => BlockDefinition.new("five line", Matrix[[0, 0, 0, 0, 0],[0, 1, 2, 3, 4]]),
	:large_corner => BlockDefinition.new("large corner", Matrix[[0, 0, 0, 1, 2],[0, 1, 2, 2, 2]]),
	:small_corner => BlockDefinition.new("small corner", Matrix[[0, 0, 1],[0, 1, 1]]),
	:large_l => BlockDefinition.new("large l", Matrix[[0, 1, 0, 0, 0],[0, 0, 1, 2, 3]]),
	:small_l => BlockDefinition.new("small l", Matrix[[0, 1, 0, 0],[0, 0, 1, 2]]),
	:ewe => BlockDefinition.new("ewe", Matrix[[0, 1, 2, 0, 2],[0, 0, 0, 1, 1]]),
	:short_t => BlockDefinition.new("short t", Matrix[[1, 0, 1, 2],[0, 1, 1, 1]]),
	:long_t => BlockDefinition.new("long t", Matrix[[1, 1, 0, 1, 2],[0, 1, 2, 2, 2]]),
	:stylish => BlockDefinition.new("stylish", Matrix[[1, 1, 2, 0, 1],[0, 1, 1, 2, 2]]),
	:conjoined_squares => BlockDefinition.new("conjoined squares", Matrix[[0, 1, 0, 1, 0],[0, 0, 1, 1, 2]]),
	:line_with_growth => BlockDefinition.new("line with growth", Matrix[[0, 0, 0, 1, 0],[0, 1, 2, 2, 3]])
}


def map_matrix_to_origin(matrix)
	x_row = matrix.row(0).to_a
	y_row = matrix.row(1).to_a
	min_x = x_row.min
	min_y = y_row.min

	new_matrix = matrix.dup

	matrix.column_count.times do |index|
		col = matrix.column(index)
		x, y = col[0], col[1]
		
		new_matrix[0, index] = x - min_x
		new_matrix[1, index] = y - min_y
	end

	new_matrix
end

def same_dimensions?(shape_definition, unknown_shape)
	shape_definition.dimensions == unknown_shape.dimensions
end

def are_same_shape?(shape_definition, unknown_shape)
	return false unless same_dimensions?(shape_definition, unknown_shape)

	t = [
		TRANSFORMS[:identity],
		TRANSFORMS[:reflect_x],
		TRANSFORMS[:reflect_y],
		TRANSFORMS[:rot_180],
		TRANSFORMS[:rot_90_ac],
		TRANSFORMS[:rot_90_c],
		TRANSFORMS[:reflect_y_x],
		TRANSFORMS[:reflect_y_negative_x],
	]

	t.length.times do |index|
		unknown_shape_at_origin = map_matrix_to_origin(unknown_shape.matrix)
		transformed_shape = map_matrix_to_origin(t[index].matrix*shape_definition.matrix)
		return true if unknown_shape_at_origin.same(transformed_shape)
	end

	return false
end

def find_shape_name(unknown_shape)
	# no point checking shapes of a different size
	BLOCKS.find_all { |name, block| block.size == unknown_shape.size }.each do |name, block|
		if are_same_shape?(block, unknown_shape)
			return name.to_s
		end
	end

	return "not a known block shape"
end

# plot_transformed_block(TRANSFORMS[:identity], BLOCKS[:small_corner])
# plot_transformed_block(TRANSFORMS[:reflect_x], BLOCKS[:small_corner])

# result = TRANSFORMS[:reflect_x].matrix * BLOCKS[:small_corner].matrix
# result = map_matrix_to_origin(result)
# Paper.new(result, "moved to origin").plot

# line = BLOCKS[:five_line]
# moved_line = UserShape.new("five line moved", Matrix[[7, 8, 9, 10, 11], [4, 4, 4, 4, 4]])

# shapes_match = are_same_shape?(line, moved_line)
# puts "Recognises transformed shape: #{shapes_match}"

# unknown_shape = UserShape.new("unknown", Matrix[[9, 8, 9, 10, 8], [8, 9, 9, 9, 10]])
# shape_name = find_shape_name(unknown_shape)
# puts "Shape name of #{unknown_shape.name} is #{shape_name}"

# u_origin = map_matrix_to_origin(unknown_shape.matrix)
# transformed_block = map_matrix_to_origin(TRANSFORMS[:reflect_y_negative_x].matrix * BLOCKS[:stylish].matrix)

# Paper.new(BLOCKS[:stylish].matrix, "stylish").plot

# title = "Unknown shape at origin"
# Paper.new(u_origin, title).plot
# puts u_origin

# title = "Transformed stylish"
# Paper.new(transformed_block, title).plot
# puts transformed_block

# class BlockDefinitionContainer
# 	def self.[](name)
# 		BLOCKS[name]
# 	end
# end

# small_square = BlockDefinitionContainer[:small_square]
# puts "Matrix of small square: #{small_square.matrix}"

BLOCKS.values.each { |block| Paper.new(block.matrix, block.name).plot }
