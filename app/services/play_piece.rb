require 'matrix'

class PlayPiece
	def initialize(player, coordinates)
		@player = player
		@coordinates = coordinates
		@game = player.game
	end

	def call
		if @game.active_player != @player
			return false
		end

		if @coordinates.empty?
			@player.turns.create!(shape: nil, transform: nil, x: nil, y: nil)
			return true
		end

		validate_move = ValidateMove.new(@player, @coordinates)
		move_is_valid = validate_move.call

		if !move_is_valid
			return false
		end

		identified_shape = validate_move.identified_shape
		if !identified_shape.identified?
			return false
		end

		colour = @game.colours[@game.turns.length % @game.colours.length]
		shape = identified_shape.shape
		transform = identified_shape.transform
		position = identified_shape.position

		@player.turns.create!(shape: shape, transform: transform, x: position.x, y: position.y)

		move_is_valid
	end
end