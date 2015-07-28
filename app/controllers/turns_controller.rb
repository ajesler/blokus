class TurnsController < ApplicationController
	before_action :load_player
	before_action :load_game

	def index
		@turns = @game.turns.play_order
	end

	def create
		create_turn_params = CreateTurnFormObject.new(params)

		if create_turn_params.valid?
			created = PlayPiece.new(@player, create_turn_params.coordinates).call
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

	def load_player
		@player = current_user.players.find_by!(game_id: game_id)
	end

	def load_game
		@game = @player.game
	end

	def game_id
		params.require(:game_id)
	end
end