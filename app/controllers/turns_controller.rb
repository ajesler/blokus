class TurnsController < ApplicationController
	def index
		@turns = @game.turns
	end

	def create
		# create a new turn in a game
		# expect: player, shape, transform, position { x, y }
	end

	private

	def load_game
		@game = current_user.games.find(id: game_id)
	end

	def game_id
		params.require(:game_id)
	end
end