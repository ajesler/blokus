require 'rails_helper'

RSpec.describe ScorePlayer do
  fixtures :all

  let(:player) { players(:one) }
  let(:score_player) { ScorePlayer.new(player) }

  describe "#call" do
    context "with no pieces played" do
      before do
        player.game.turns.each { |turn| turn.destroy! }
      end

      it "scores the player correctly" do
        expect(player.turns.size).to eq 0
        expect(score_player.call).to eq -89
      end
    end

    context "when some pieces have been played" do
      it "scores the player correctly" do
        
      end
    end

    context "with all pieces played" do
      context "when the last piece is not the single square" do
        it "scores the player correctly" do
          
        end
      end

      context "when the last piece is the single square" do
        it "scores the player correctly" do
          
        end
      end
    end
  end
end