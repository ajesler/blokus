class Game < ActiveRecord::Base
	has_many :turns, through: :players
	has_many :players, dependent: :destroy

	validates :players, presence: true

	def shapes
		Shapes.shapes
	end
end