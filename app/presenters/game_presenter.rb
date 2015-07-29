class GamePresenter
  attr_accessor :finished, :active_colour, 
                :is_active_player, :scores, :game_id,
                :available_shapes, :board

  def initialize(player, turns_url)
    @player = player
    @game = @player.game

    @game_id = @game.id

    game_board = ConstructBoard.new(@game).call
    @board = BoardPresenter.new(game_board).board

    @finished = @game.finished?
    @active_colour = @game.active_colour
    @is_active_player = @game.active_player == @player

    @scores = nil
    if @finished
      @scores = nil
      # calculate the players scores
    end

    used_shapes = @player.turns.map { |turn| Shapes[turn.shape] }
    @available_shapes = @game.shapes - used_shapes
  end
end