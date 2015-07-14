class Turn < ActiveRecord::Base
	belongs_to :player

	validates :player, presence: true
	validates :shape, shape: true
	validates :shape, presence: true, if: :has_shape_or_transform?
	validates :transform, transform: true
	validates :transform, presence: true, if: :has_shape_or_transform?
	validates :x, :y, absence: true, unless: :has_shape_or_transform?
	validates :x, :y,
		inclusion: { in: 0...Board::DEFAULT_SIZE }, 
		numericality: { only_integer: true }, 
		if: :has_shape_or_transform?

	def position
		@position ||= Point.new(x, y)
	end

	def has_shape_or_transform?
		shape.present? || transform.present?
	end

	def pass?
		!shape.present? && !transform.present?
	end
end