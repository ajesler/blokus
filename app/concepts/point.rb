class Point < Struct.new(:x, :y)
  # TODO remove?
  def <=>(point)
    compare = self.x <=> point.x
    if compare == 0
      compare = self.y <=> point.y
    end
    return compare
  end

  def self.from_string(point_string)
    string_parts = point_string.split(',')
    x,y = string_parts.map(&:to_i)
    string_parts.size == 2 ? new(x, y) : nil
  end

  def self.from_string!(point_string)
    point = from_string(point_string)
    raise ArgumentError, "Cannot extract Coordinate from #{point_string}" if point.nil?
    point
  end

  def to_s
    "#{x},#{y}"
  end
end