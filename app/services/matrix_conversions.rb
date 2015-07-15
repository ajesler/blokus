require 'matrix'

class MatrixConversions
	def self.from_point_set(points)
		from_point_array(points.to_a)
	end

	def self.from_point_array(points)
		Matrix.build(2, points.length) do |row, column|
			(row == 0) ? points[column].x : points[column].y
		end
	end

	def self.to_point_set(matrix)
		matrix.column_vectors.each.with_object(Set.new) do |column, points|
			points.add(Point.new(column[0], column[1]))
		end
	end

	def self.to_point_array(matrix)
		matrix.column_vectors.each.with_object([]) do |column, points|
			points << Point.new(column[0], column[1])
		end
	end

	def self.apply_offset(matrix, x_offset, y_offset)
		Matrix.build(matrix.row_count, matrix.column_count) do |row, column|
			offset = (row == 0) ? x_offset : y_offset
			matrix[row, column] + offset
		end
	end

	def self.move_to_origin(matrix)
		min_x, min_y = min_in_row(matrix, 0), min_in_row(matrix, 1)

		Matrix.build(matrix.row_count, matrix.column_count) do |row, col|
			origin_offset = row == 0 ? min_x : min_y
			matrix[row, col] - origin_offset
		end
	end

	def self.min_in_row(matrix, row)
		matrix.row(row).to_a.min
	end
end