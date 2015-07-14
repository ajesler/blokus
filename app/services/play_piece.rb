require 'matrix'

class PlayPiece
	def initialize(game, player, coordinates)
		@game = game
		@player = player
		@coordinates = coordinates
	end

	def call
		@piece = MatrixConversions.from_point_array(@coordinates)

		# TODO rename identification
		@identification = ShapeIdentifier.identify(@piece)

		if !@identification.identified?
			return false
		end

		@colour = Colours.colours[game.turns.length + 1 % @game.colours.length]
		@shape = @identification.shape
		@transform = @identification.transform
		@position = @identification.position

		@board = ConstructBoard.new(@game).call

		piece_is_valid = valid?
		if piece_is_valid?
			@player.turn.create!(shape: @shape, transform: @transform, x: @position.x, y: @position.y)
		end

		piece_is_valid
	end

	private

	def valid?
		valid = is_recognised_piece? &&
			piece_has_not_been_used? &&
			squares_covered_are_empty? &&
		
		if is_colours_first_turn?
			valid &&= covers_a_corner_square?
		else
			valid &&= at_least_one_corner_touching?
			valid &&= does_not_touch_on_edges?
		end

		valid
	end

	def is_colours_first_turn?
		@game.turns.each.with_index do |index, turn|
			turn_colour = Colour.colours[index % @game.colours.length]

			return false if turn_colour == @colour
		end

		return true
	end

	def is_recognised_piece?
		@identification.identified?
	end

	def piece_has_not_been_used?
		@game.turns.each.with_index do |index, turn|
			turn_colour = Colour.colours[index % @game.colours.length]
			piece_matches = turn.shape == @shape && turn_colour == @colour

			return false if piece_matches
		end

		return true
	end

	def squares_covered_are_empty?
		@coordinates.all? { |point| @board.empty?(point.x, point.y) }
	end

	def covers_a_corner_square?
		max_board_index = @board.size - 1
		corner_squares = Set.new([
			Point.new(0,0),
			Point.new(0, max_board_index),
			Point.new(max_board_index,0),
			Point.new(max_board_index, max_board_index)
		])

		Set.new(@coordinates).intersect?(corner_squares)
	end

	def at_least_one_corner_touching?
		@board.squares_sharing_a_corner_with(@coordinates).any? do |point|
			@board[point.x, point.y] == @colour
		end
	end

	def does_not_touch_on_edges?
		@board.squares_sharing_an_edge_with(@coordinates).none? do |point| 
			@board[point.x, point.y] == @colour
		end
	end
end