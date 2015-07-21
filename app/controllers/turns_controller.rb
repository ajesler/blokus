class TurnsController < ApplicationController
	before_action :load_game

	def index
		@turns = @game.turns
	end

	def create
		create_turn_params = CreateTurnFormObject.new(params)

		if create_turn_params.valid?
			created = PlayPiece.new(@game, create_turn_params.player, create_turn_params.coordinates)
			if created
				# TODO respond positively
			else
				# TODO reject with error
			end
		else
			# TODO reject with error
		end
	end

	private

	def load_game
		@game = current_user.games.find_by!(id: game_id)
	end

	def game_id
		params.require(:game_id)
	end
end