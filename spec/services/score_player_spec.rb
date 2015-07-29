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
      before do
        player.turns.offset(2).each { |turn| turn.destroy! }
      end

      it "scores the player correctly" do
        expect(player.turns.size).to eq 2
        expect(score_player.call).to eq -80
      end
    end

    context "with all but one pieces played" do
      before do
        player.game.turns.each { |turn| turn.destroy! }
        Shapes.names.sort[0..-2].each do |name|
          player.turns.build(shape: name, transform: "identity", x: 0, y: 0)
        end
      end

      it "scores the player correctly" do
        expect(player.turns.size).to eq 20
        expect(score_player.call).to eq -5
      end
    end

    context "with all pieces played" do
      context "when the last piece is not the single square" do
        before do
          player.game.turns.each { |turn| turn.destroy! }
          Shapes.names.sort.each do |name|
            player.turns.build(shape: name, transform: "identity", x: 0, y: 0)
          end
        end

        it "scores the player correctly" do
          expect(player.turns.size).to eq 21
          expect(score_player.call).to eq 15
        end
      end

      context "when the last piece is the single square" do
        before do
          player.game.turns.each { |turn| turn.destroy! }
          Shapes.names.sort.reverse.each do |name|
            player.turns.create(shape: name, transform: "identity", x: 0, y: 0)
          end
        end

        it "scores the player correctly" do
          expect(player.turns.size).to eq 21
          expect(score_player.call).to eq 20
        end
      end
    end
  end
end