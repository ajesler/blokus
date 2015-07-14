class Board
	DEFAULT_SIZE = 20

	attr_reader :size

	def initialize(size=DEFAULT_SIZE)
		@grid = empty_grid
		@size = size
	end

	def [](x,y)
		@grid[x][y]
	end

	def []=(x,y,colour)
		@grid[x][y] = colour
	end

	def empty?(x,y)
		@grid[x][y].nil?
	end

	def squares_sharing_an_edge_with(points)
		points.each.with_object(Set.new) do |point, result_set|
			adjacent_squares(point.x, point.y).each { |adjacent_point| result_set.add(adjacent_point) }
		end
	end

	def squares_sharing_a_corner_with(points)
		points.each.with_object(Set.new) do |point, result_set|
			adjacent_corners(point.x, point.y).each { |corner_point| result_set.add(corner_point) }
		end
	end

	private

	def adjacent_squares(x, y)
		offset_squares([[0, 1], [1, 0], [0, -1], [-1, 0]])
	end

	def adjacent_corners(x, y)
		offset_squares([[1, 1], [-1, 1], [1, -1], [-1, -1]])
	end

	def offset_squares(offsets)
		offsets.each.with_object([]) do |offset, squares|
			x_offset, y_offset = offset[0], offset[1]
			new_x, new_y = x+x_offset, y+y_offset

			squares.add(Point.new(new_x, new_y)) if position_on_board?(new_x, new_y)
		end
	end

	def position_on_board?(x,y)
		board_range = (0...size)

		board_range.include?(x) && board_range.include?(y)
	end

	def empty_grid
		grid = []

		SIZE.times do 
			grid << Array.new(SIZE, nil)
		end

		grid
	end
end