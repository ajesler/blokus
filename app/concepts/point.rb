class Point < Struct.new(:x, :y)
  # TODO remove?
  def <=>(point)
    compare = self.x <=> point.x
    if compare == 0
      compare = self.y <=> point.y
    end
    return compare
  end
end