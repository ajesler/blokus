class Player < ActiveRecord::Base
  belongs_to :user
  belongs_to :game

  validates :user, :game, presence: true

  delegate :name, to: :user
end
