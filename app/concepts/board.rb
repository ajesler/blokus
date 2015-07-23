class Board
	DEFAULT_SIZE = 20

	attr_reader :size

	def initialize(size=DEFAULT_SIZE)
		@size = size
		@grid = empty_grid
	end

	def [](x,y)
		validate_position(x, y)
		@grid[x][y]
	end

	def []=(x,y,colour)
		validate_position(x, y)
		@grid[x][y] = colour
	end

	def empty?(x,y)
		validate_position(x, y)
		@grid[x][y].nil?
	end

	def valid_position?(x, y)
		board_range = (0...@size)

		board_range.include?(x) && board_range.include?(y)
	end

	# TODO move these two methods?
	def squares_sharing_an_edge_with(points)
		points.each.with_object(Set.new) do |point, result_set|
			adjacent_squares(point.x, point.y).each { |adjacent_point| result_set.add(adjacent_point) }
		end
	end

	def squares_sharing_a_corner_with(points)
		points.each.with_object(Set.new) do |point, result_set|
			adjacent_corners(point.x, point.y).each { |corner_point| result_set.add(corner_point) }
		end
		# TODO remove the original points? Will this influence the result?
	end

	private

	def adjacent_squares(x, y)
		offset_squares([[0, 1], [1, 0], [0, -1], [-1, 0]], x, y)
	end

	def adjacent_corners(x, y)
		offset_squares([[1, 1], [-1, 1], [1, -1], [-1, -1]], x, y)
	end

	def offset_squares(offsets, x, y)
		offsets.each.with_object([]) do |offset, squares|
			x_offset, y_offset = offset[0], offset[1]
			new_x, new_y = x+x_offset, y+y_offset

			squares.push(Point.new(new_x, new_y)) if valid_position?(new_x, new_y)
		end
	end

	def validate_position(x, y)
		raise ArgumentError, "#{x} or #{y} is outside board bounds" unless valid_position?(x, y)
	end

	def empty_grid
		@size.times.each.with_object([]) do |_, grid|
			grid << Array.new(@size, nil)
		end
	end
end