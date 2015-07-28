class Gameresenter
  def initialize(player)
    @player = player
    @game = @player.game

    @finished = @game.finished?
    @active_colour = @game.active_colour
    @is_active_player = @game.active_player == @player

    @scores = nil
    if @finished
      @scores = nil
      # calculate the players scores
    end

    @turns = @game.turns
    @turns_url = game_turns_url(@game)

    used_shapes = @player.turns.map { |turn| turn.shape }
    available_shapes = @game.shapes - used_shapes

    @pieces = nil
    # TODO create all of the isomers for each shape

    @board = nil
    # TODO create a 2D array of squares contents
  end
end