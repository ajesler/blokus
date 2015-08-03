class GamePresenter
  attr_accessor :finished, :active_colour, 
                :is_active_player, :scores, :game_id,
                :available_shapes, :board, :winner,
                :is_first_turn

  def initialize(player)
    @player = player
    @game = @player.game

    @game_id = @game.id

    game_board = ConstructBoard.new(@game).call
    @board = BoardPresenter.new(game_board).board

    @finished = @game.finished?
    @active_colour = @game.active_colour
    @is_active_player = @game.active_player == @player
    if @is_active_player
      @is_first_turn = @player.turns.empty?
    end

    @scores = @game.players.play_order.each.with_object([]) do |player, results|
      score = ScorePlayer.new(player).call

      player_index = @game.players.play_order.to_a.find_index(player)
      colour = @game.colours[player_index]

      result = {
        :player => player,
        :score => score,
        :colour => colour.to_s
      }

      results << result
    end
    @scores.sort_by! { |result| result[:player].id }

    if @finished
      # TODO what if there is a draw?
      @winner = @scores.max_by { |result| result[:score] }[:player].id
    end

    @available_shapes = FindAvailableShapes.new(@player).call
  end
end