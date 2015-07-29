require 'matrix'

class BoardPresenter
	attr_accessor :board

	def initialize(game_board)
		@board = Matrix.build(game_board.size, game_board.size) do |row, col|
			element = game_board[col, row]
			element.nil? ? "" : element
		end
	end
end