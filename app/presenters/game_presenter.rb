class GamePresenter
  attr_accessor :finished, :active_colour, 
                :is_active_player, :scores, :game_id,
                :available_shapes, :board, :winner

  def initialize(player, turns_url)
    @player = player
    @game = @player.game

    @game_id = @game.id

    game_board = ConstructBoard.new(@game).call
    @board = BoardPresenter.new(game_board).board

    @finished = @game.finished?
    @active_colour = @game.active_colour
    @is_active_player = @game.active_player == @player

    if @finished
      @scores = @game.players.each.with_object({}) do |player, scores|
        score = ScorePlayer.new(player).call
        scores[player] = score
      end

      # TODO what if there is a draw?
      @winner = @scores.max_by { |player, score| score }[0].id
    end

    used_shapes = @player.turns.map { |turn| Shapes[turn.shape] }
    @available_shapes = (@game.shapes - used_shapes).sort { |a, b| b.size <=> a.size }
  end
end