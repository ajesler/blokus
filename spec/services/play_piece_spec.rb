require 'rails_helper'

RSpec.describe PlayPiece do
  fixtures :all

  def print_game(game)
    board = ConstructBoard.new(game).call
    puts
    puts BoardPrinter.print(board)
    puts
  end

  describe ".call" do
    let(:game) { games(:one) }
    let(:player) { players(:one) }
    let(:play_piece) { PlayPiece.new(player, coordinates) }

    subject { play_piece.call }

    context "when it is not the players turn" do
      before do 
        game.turns.play_order.offset(3).each { |turn| turn.destroy! }
      end

      # F identity 0 17
      let(:coordinates) { [Point.new(0, 19), Point.new(1, 19), Point.new(1, 18), Point.new(2, 18), Point.new(1, 17)] }

      it "the move is rejected" do
        expect(play_piece.call).to be false        
      end
    end

    context "when the move has no coordinates" do
      before do 
        game.turns.play_order.each { |turn| turn.destroy! }
      end

      let(:coordinates) { [] }

      it "is accepted as a pass" do
        expect(player.turns.size).to eq 0
        expect(play_piece.call).to be true
        expect(player.turns.size).to eq 1
        
        turn = player.turns.first
        
        expect(turn.transform).to be_nil
        expect(turn.shape).to be_nil
        expect(turn.x).to be_nil
        expect(turn.y).to be_nil
      end
    end

    context "when the game is finished" do
      before do
        game.turns.play_order.each { |turn| turn.destroy! }
        [players(:one), players(:two), players(:three), players(:four)].each do |player|
          player.turns.create(shape: nil, transform: nil, x: nil, y: nil)
        end
      end
      
      let(:coordinates) { [Point.new(0, 19), Point.new(1, 19), Point.new(1, 18), Point.new(2, 18), Point.new(1, 17)] }

      it "rejects the move" do
        expect(play_piece.call).to be false
      end
    end
  end
end