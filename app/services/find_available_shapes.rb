class FindAvailableShapes
  def initialize(player)
    @player = player
    @game = @player.game
  end

  def call
    # binding.pry
    used_shapes = @player.turns.play_order.map { |turn| Shapes[turn.shape] }
    game_shapes = @game.shapes
    available_shapes = (game_shapes - used_shapes)
    available_shapes.sort { |a, b| b.size <=> a.size }
  end
end