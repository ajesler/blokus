class ValidateMove
  attr_reader :identified_shape

  def initialize(player, coordinates)
    @player = player
    @coordinates = coordinates
    @game = player.game
  end

  def call
    @identified_shape = identify_shape

    if @identified_shape.identified?
      @colour = @game.colours[@game.turns.length % @game.colours.length]
      @shape = @identified_shape.shape
      @transform = @identified_shape.transform
      @position = @identified_shape.position
    else
      return false
    end

    @board = ConstructBoard.new(@game).call

    return valid?
  end

  private

  def identify_shape
    piece = MatrixConversions.from_point_array(@coordinates)
    ShapeIdentifier.identify(piece)
  end

  def valid?
    valid = all_points_on_board?
    valid &&= is_recognised_piece?
    valid &&= piece_has_not_been_used?
    valid &&= squares_covered_are_empty?

    if is_first_turn_of_colour?
      valid &&= covers_a_corner_square?
    else
      valid &&= at_least_one_corner_touching?
      valid &&= does_not_touch_on_edges?
    end

    valid
  end

  def is_first_turn_of_colour?
    @game.turns.play_order.each.with_index do |turn, index|
      turn_colour = @game.colours[index % @game.colours.length]
      return false if turn_colour == @colour
    end

    return true
  end

  def all_points_on_board?
    @coordinates.all? { |point| @board.valid_position?(point.x, point.y) }
  end

  def is_recognised_piece?
    @identified_shape.identified?
  end

  def piece_has_not_been_used?
    @game.turns.play_order.each.with_index do |turn, index|
      turn_colour = @game.colours[index % @game.colours.length]
      piece_matches = turn.shape == @shape && turn_colour == @colour

      return false if piece_matches
    end

    return true
  end

  def squares_covered_are_empty?
    @coordinates.all? { |point| @board.empty?(point.x, point.y) }
  end

  def covers_a_corner_square?
    max_board_index = @board.size - 1
    corner_squares = Set.new([
      Point.new(0,0),
      Point.new(0, max_board_index),
      Point.new(max_board_index,0),
      Point.new(max_board_index, max_board_index)
    ])

    Set.new(@coordinates).intersect?(corner_squares)
  end

  def at_least_one_corner_touching?
    squares = @board.squares_sharing_a_corner_with(@coordinates)
    squares = squares.subtract(@coordinates)

    squares.any? do |point|
      @board[point.x, point.y] == @colour
    end
  end

  def does_not_touch_on_edges?
    squares = @board.squares_sharing_an_edge_with(@coordinates)
    squares = squares.subtract(@coordinates)

    squares.none? do |point| 
      @board[point.x, point.y] == @colour
    end
  end
end