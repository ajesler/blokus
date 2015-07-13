class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
           :recoverable, :rememberable, :validatable

  has_many :players, dependent: :destroy
	has_many :games, through: :players

  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
