class GamePresenter
  attr_accessor :player, :turns, :player_id, :turns_url, :finished,
                :active_colour, :is_active_player, :pieces, :game,
                :scores, :game_id

  def initialize(player, turns_url)
    @player = player
    @game = @player.game

    @game_id = @game.id

    @turns_url = turns_url
    @player_id = @player.id

    @finished = @game.finished?
    @active_colour = @game.active_colour
    @is_active_player = @game.active_player == @player

    @scores = nil
    if @finished
      @scores = nil
      # calculate the players scores
    end

    @turns = @game.turns.play_order

    used_shapes = @player.turns.map { |turn| turn.shape }
    available_shapes = @game.shapes - used_shapes

    @pieces = nil
    # TODO create all of the isomers for each shape
  end
end