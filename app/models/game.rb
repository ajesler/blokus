class Game < ActiveRecord::Base
	has_many :turns, through: :players
	has_many :players, dependent: :destroy

	validates :players, presence: true

	def shapes
		Shapes.shapes
	end

	def colours
		Colours.colours
	end

  def active_colour
    player_index = turns.size % 4
    colours[player_index]
  end

  def active_player
    player_index = turns.size % 4
    players.play_order[player_index]
  end
end