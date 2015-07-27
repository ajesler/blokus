class LobbyPresenter
	def initialize(user)
		@user = user
	end

	def games
		@games ||= @user.games.order(id: :desc)
	end
end