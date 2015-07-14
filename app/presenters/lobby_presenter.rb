class LobbyPresenter
	def initialize(user)
		@user = user
	end

	def games
		@games ||= construct_lobby_games
	end

	LobbyGame = Struct.new(:id, :player_one, :player_two, :player_three, :player_four)

	private

	def construct_lobby_games
		games = []

		@user.games.order(id: :desc).each do |game|
			games << LobbyGame.new(game.id, game.players[0].name, game.players[1].name, game.players[2].name, game.players[3].name)
		end

		games
	end
end