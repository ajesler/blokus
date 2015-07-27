require 'rails_helper'

RSpec.describe Game, type: :model do
  fixtures :all

  let(:game) { games(:one) }

  describe "#shapes" do
    context "with a four player game" do
      it "will have 21 shapes" do
        expect(game.shapes.size).to eq 21
      end
    end
  end

  describe "#colours" do
    context "with a four player game" do
      it "will have four colours" do
        expect(game.colours.size).to eq 4
      end
    end
  end

  describe "#active_player" do
    context "in a four player game" do
      let(:player) { players(:one) }

      context "with no turns played" do
        before do
          game.turns.each { |turn| turn.destroy! }
        end

        it "returns player one" do
          expect(game.active_player).to eq player
        end
      end

      context "with four turns played" do
        before do
          game.turns.offset(4).each { |turn| turn.destroy! }
        end

        it "returns player one" do
          expect(game.active_player).to eq player
        end
      end

      context "with six turns played" do
        let(:player) { players(:three) }

        before do
          game.turns.offset(6).each { |turn| turn.destroy! }
        end

        it "returns player three" do
          expect(game.active_player).to eq player
        end
      end
    end
  end

  describe "#active_colour" do
    context "in a four player game" do
        
      context "with no turns played" do
        before do
          game.turns.each { |turn| turn.destroy! }
        end

        it "returns blue" do
          expect(game.active_colour).to eq :blue
        end
      end

      context "with four turns played" do
        before do
          game.turns.offset(4).each { |turn| turn.destroy! }
        end

        it "returns blue" do
          expect(game.active_colour).to eq :blue
        end
      end

      context "with five turns played" do
        before do
          game.turns.offset(5).each { |turn| turn.destroy! }
        end

        it "returns yellow" do
          expect(game.active_colour).to eq :yellow
        end
      end

      context "with six turns played" do
        before do
          game.turns.offset(6).each { |turn| turn.destroy! }
        end

        it "returns red" do
          expect(game.active_colour).to eq :red
        end
      end

      context "with seven turns played" do
        before do
          game.turns.offset(7).each { |turn| turn.destroy! }
        end

        it "returns green" do
          expect(game.active_colour).to eq :green
        end
      end
    end
  end
end