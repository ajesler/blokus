class StartNewGame
	def initialize(current_user, 
		player_one_user_id, player_two_user_id, player_three_user_id)

		@current_user = current_user
		@player_user_ids = [player_one_user_id, player_two_user_id, player_three_user_id]
	end

	def call
		game = Game.new

		game.players.build(user: @current_user)
		
		@player_user_ids.each do |player_user_id|
			game.players.build(user: User.find(player_user_id))
		end

		game.save!
		game
	end
end