class GamesController < ApplicationController
	def index
		@lobby = LobbyPresenter.new(current_user)
	end

	def show
		load_game
		# TODO implement this
		@active_colour = "green"
		@player_colour = "green"
		@turns_url = game_turns_path(@game)

		respond_to do |format|
			format.json { render json: @game }
			format.html { render 'show' }
		end
	end

	def new
		@game = Game.new
		@opponents = User.where.not(id: current_user)
	end

	def create
		form_object = CreateGameFormObject.new(params)

		if form_object.valid?
			new_game = StartNewGame.new(current_user,
				form_object.player_two_user_id, 
				form_object.player_three_user_id, 
				form_object.player_four_user_id).call

			redirect_to new_game
		else
			flash[:error] = "You must select three different players to join the game"
			redirect_to new_game_url
		end
	end

	private 

	def load_game
		@game = current_user.games.find_by!(id: game_id)
	end

	def game_id
		params.require(:id)
	end
end