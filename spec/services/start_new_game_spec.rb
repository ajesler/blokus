require 'rails_helper'

RSpec.describe StartNewGame do
	fixtures :users

	describe "#call" do
		let(:current_user) { users(:one) }
		let(:player_two_user_id) { users(:two).id }
		let(:player_three_user_id) { users(:three).id }
		let(:player_four_user_id) { users(:four).id }
		let(:start_new_game) { StartNewGame.new(current_user, 
			player_two_user_id, player_three_user_id, player_four_user_id) 
		}

		context "with a valid params" do
			it "creates a new game" do
				expect { start_new_game.call }.to change { Game.count }.by(1)
			end
		end

		context "with invalid invited users" do
			let(:player_two_user_id) { nil }

			it "blows up" do
				expect { start_new_game.call }.to raise_error(ActiveRecord::ActiveRecordError)
			end
		end
	end
end