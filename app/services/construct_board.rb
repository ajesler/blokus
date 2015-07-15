class ConstructBoard
	def initialize(game)
		@game = game
		@board = Board.new
	end

	def call
		@game.turns.play_order.each_with_index do |turn, index|
			add_turn_to_board(turn, index)
		end
		
		@board
	end

	private

	def add_turn_to_board(turn, index)
		colour = @game.colours[index % @game.colours.length]

		if !turn.pass?
			points_of_piece(turn).each do |point| 
				@board[point.x, point.y] = colour
			end
		end
	end

	# TODO should this be on turn?
	def points_of_piece(turn)
		return [] if turn.pass?

		shape = Shapes[turn.shape]
		transform = Transforms[turn.transform]

		matrix = MatrixConversions.move_to_origin(transform.definition*shape.definition)
		matrix_of_piece = MatrixConversions.apply_offset(matrix, turn.x, turn.y)

		MatrixConversions.to_point_array(matrix_of_piece)
	end
end