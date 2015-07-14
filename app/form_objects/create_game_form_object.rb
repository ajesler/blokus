class CreateGameFormObject
	attr_reader :player_two_user_id, :player_three_user_id, :player_four_user_id

	def initialize(params)
		@player_two_user_id = params.require(:player_two_user_id)
		@player_three_user_id = params.require(:player_three_user_id)
		@player_four_user_id = params.require(:player_four_user_id)
	end

	def valid?
		@player_two_user_id != @player_three_user_id && @player_three_user_id != @player_four_user_id
	end
end