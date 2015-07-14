class TurnsController < ApplicationController
	before_action :load_game

	def index
		@turns = @game.turns
	end

	def create
		# create a new turn in a game
		# expect: player, array of coordinates
		# convert to shape, transform, position { x, y }
		# json only, so how to show errors?
	end

	private

	def load_game
		@game = current_user.games.find_by!(id: game_id)
	end

	def game_id
		params.require(:game_id)
	end
end