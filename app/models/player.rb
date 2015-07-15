class Player < ActiveRecord::Base
  belongs_to :user
  belongs_to :game

  has_many :turns, dependent: :destroy

  validates :user, :game, presence: true

  delegate :name, to: :user
end
