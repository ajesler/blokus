require 'matrix'

class Transforms
	def self.names
		TRANSFORMS.keys.sort!
	end

	def self.transforms
		TRANSFORMS.values
	end

	def self.[](name)
		TRANSFORMS[name]
	end

	private 

	def self.build_transforms_hash
		transforms = [
			Transform.new("identity", Matrix[[1,0],[0, 1]]),
			Transform.new("rotate_90_clockwise", Matrix[[0, 1], [-1, 0]]),
			Transform.new("rotate_90_anticlockwise", Matrix[[0, -1], [1, 0]]),
			Transform.new("rotate_180", Matrix[[-1, 0], [0, -1]]),
			Transform.new("reflection_in_x", Matrix[[1, 0], [0, -1]]),
			Transform.new("reflection_in_y", Matrix[[-1, 0], [0, 1]]),
			Transform.new("reflect_in_y_x", Matrix[[0, 1], [1, 0]]),
			Transform.new("reflect_in_y_neg_x", Matrix[[0, -1], [-1, 0]])
		]

		transforms.each.with_object({}) do |transform, hash|
			hash[transform.name] = transform
		end
	end

	TRANSFORMS = build_transforms_hash
end