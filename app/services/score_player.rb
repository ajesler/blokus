class ScorePlayer
  def initialize(player)
    @player = player
  end

  def call
    score = 0

    if all_pieces_played?
      score += 15
      score += 5 if last_piece_was_single_square?
    else
      score -= unused_square_count
    end

    score
  end

  private

  def all_pieces_played?
    unused_pieces.empty?
  end

  def last_piece_was_single_square?
    last_piece = @player.turns.reverse_play_order.first
    !last_piece.nil? && last_piece.shape == "1"
  end

  def unused_square_count
    unused_pieces.map { |shape| shape.size }.reduce(:+)
  end

  def unused_pieces
    @unused_pieces ||= find_unused_pieces
  end

  def find_unused_pieces
    played_shapes = @player.turns.select { |turn| !turn.pass? }.map { |turn| Shapes[turn.shape] }
    @player.game.shapes - played_shapes
  end
end