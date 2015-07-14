class ConstructBoard
	def initialize(game)
		@game = game
		@board = Board.new
	end

	def call
		@game.turns.each_with_index do |turn, index|
			add_turn_to_board(turn, index)
		end

		@board
	end

	private

	def add_turn_to_board(turn, index)
		colour = Colour.colours[index % 4]

		if !turn.pass?
			points_of_piece(turn).each { |point| @board[point.x, point.y] = colour }
		end
	end

	def points_of_piece(turn)
		return [] if turn.pass?

		shape = Shapes[turn.shape]
		transform = Transforms[turn.transform]

		matrix_of_piece = MatrixConversions.offset(transform*shape, turn.x, turn.y)

		MatrixConversions.to_point_array(matrix_of_piece)
	end
end