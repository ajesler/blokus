# TODO Remove this
require 'set'
require 'matrix'

class Matrix
  def []=(i, j, x)
    @rows[i][j] = x
  end
end

class Paper
  SHAPE_CHAR = "\u25FC"
  SHAPE_ORIGIN_CHAR = "\u25A3"
  ORIGIN_CHAR = "\u25A2"
  DEFAULT_DIMENSION = 11

  def initialize(matrix, title=nil, height=DEFAULT_DIMENSION, width=DEFAULT_DIMENSION)
    @matrix = matrix
    @title = title
    @height = height
    @width = width
  end

  def plot
    draw_matrix
    print
  end

  def self.isomers(shape_name)
    # Print each transform of a shape
    shape = Shapes[shape_name]
    isomer_set = Set.new

    Transforms.transforms.each do |transform|
      isomer = transform.definition * shape.definition
      # Paper.new(isomer, "Isomer without moving to origin").plot
      x_min = MatrixConversions.min_in_row(isomer, 0)
      y_min = MatrixConversions.min_in_row(isomer, 1)
      # puts "Min x=#{x_min}, min y=#{y_min}"

      isomer_at_origin = MatrixConversions.move_to_origin(isomer)
      point_set = MatrixConversions.to_point_set(isomer_at_origin)

      if !isomer_set.include?(point_set)
        isomer_set.add(point_set)
        Paper.new(isomer_at_origin, shape.name + " " + transform.name).plot
      # else
      #   puts "Excluding for #{transform.name}"  
      end
      # puts print_set(point_set)
    end
    nil
  end

  private

  def self.print_set(set)
    sorted = set.to_a.sort!
    sorted.each.with_object([]) do |point, coordinates|
      coordinates << "#{point.x}, #{point.y}"
    end.join(" | ")
  end

  def draw_matrix
    @paper = Matrix.build(@height, @width) { '.' }
    x_origin = (@width / 2)
    y_origin = (@height / 2)

    # assumes the input matix is 2xN
    @matrix.column_count.times do |index|
      col = @matrix.column(index)
      x, y = col[0], col[1]
      @paper[y_origin-y, x_origin+x] = SHAPE_CHAR
    end

    # set the origin marker
    origin_covered = @paper[x_origin, y_origin] == SHAPE_CHAR
    @paper[x_origin, y_origin] = origin_covered ? SHAPE_ORIGIN_CHAR : ORIGIN_CHAR
  end

  def print 
    puts
    puts "# #{@title}" if @title
    # puts @matrix
    puts @paper.to_a.map { |row| row.join(' ') }
  end
end