class BoardPrinter
  BLOCK = "\u25FC"

  def self.print(board)
    board_string = board.size.times.each.with_object([]) do |y, lines|
      lines << board.size.times.each.with_object([]) do |x, line|
        square = board[x,board.size-y-1]

        out = square.nil? ? ". " : square.to_s.chars.first.upcase + " "
        out = square.nil? ? ". " : BLOCK.colorize(square) + " "

        line << out
      end.join
    end.join("\n")

    puts board_string
  end

  def self.overlay_on_board(board, coordinates)
    # dup the board

    board_dup = Board.new
    board.size.times.each do |y|
      board.size.times.each do |x|
        board_dup[x, y] = board[x, y]
      end
    end

    coordinates.each { |point| board_dup[point.x, point.y] = :magenta }

    puts print(board_dup)
  end
end