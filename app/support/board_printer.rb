class BoardPrinter
  BLOCK = "\u25FC"

  def self.print(board)
    board.size.times.each.with_object([]) do |y, lines|
      lines << board.size.times.each.with_object([]) do |x, line|
        square = board[x,board.size-y-1]

        out = square.nil? ? ". " : square.to_s.chars.first.upcase + " "
        out = square.nil? ? ". " : BLOCK.colorize(square) + " "

        line << out
      end.join
    end.join("\n")
  end
end