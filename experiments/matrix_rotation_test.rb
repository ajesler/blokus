require 'matrix'

def print_matrix(matrix)
	puts matrix.to_a.map(&:inspect)
end

class Matrix
  def []=(i, j, x)
    @rows[i][j] = x
  end
end

class Paper
	SHAPE_CHAR = "\u2B1B"
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

		# assumes the input matix is 2xn.
		@matrix.column_count.times do |index|
			col = @matrix.column(index)
			x, y = col[0], col[1]
			@paper[@height-y_origin-y-1, x_origin+x] = SHAPE_CHAR
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

def plot_rotation(rotation, points, title)
	result = rotation * points

	Paper.new(result, title).plot
end

rotate_90_clockwise = Matrix[ [0, 1], [-1, 0] ]
rotate_90_anticlockwise = Matrix[ [0, -1], [1, 0 ] ]
rotate_180 = Matrix[ [-1, 0], [0, -1] ]
reflect_on_y_axis = Matrix[ [-1, 0], [0, 1] ]
reflect_on_x_axis = Matrix[ [1, 0], [0, -1] ]

shape = Matrix[ [0, 0, 1, 1], [0, 1, 1, 2] ]
# shape = Matrix[ [0, 1, 1, 2, 2], [0, 0, 1, 1, 2] ]

Paper.new(shape, "Initial shape").plot
plot_rotation(rotate_180, shape, "Rotate 180 degrees")
plot_rotation(rotate_90_clockwise, shape, "Rotate 90 degrees clockwise")
plot_rotation(rotate_90_anticlockwise, shape, "Rotate 90 degrees anticlockwise")
plot_rotation(reflect_on_x_axis, shape, "reflect on x axis")
plot_rotation(reflect_on_y_axis, shape, "reflect on y axis")
