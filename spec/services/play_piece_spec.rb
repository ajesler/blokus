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
    let(:play_piece) { PlayPiece.new(game, player, coordinates) }

    subject { play_piece.call }

    context "when the piece is on the board" do
      context "when the piece is recognised" do
        context "when the piece has not been used" do
          context "when the squares covered by the piece are empty" do
            context "when it is the colours first turn" do
              before do 
                game.turns.play_order.offset(3).each { |turn| turn.destroy! }
              end
              
              let(:player) { players(:four) }

              context "when the piece covers a corner square" do
                # F identity 0 17
                let(:coordinates) { [Point.new(0, 19), Point.new(1, 19), Point.new(1, 18), Point.new(2, 18), Point.new(1, 17)] }

                it "the move is accepted" do
                  expect(subject).to be true
                end
              end

              context "when the piece does not cover a corner square" do
                let(:coordinates) { [Point.new(1, 19), Point.new(2, 19), Point.new(2, 18), Point.new(3, 18), Point.new(2, 17)] }

                it "the move is rejected" do
                  expect(subject).to be false
                end
              end
            end

            context "when the colour has pieces on the board" do
              context "when the piece touches at least one corner of the same colour" do
                context "when the piece does not share any edges with the same colour" do
                  # P rotate_90_anticlockwise 6 6 
                  let(:coordinates) { [Point.new(6, 6), Point.new(7, 6), Point.new(8, 6), Point.new(7, 7), Point.new(8, 7)] }

                  it "accepts the move" do
                    expect(subject).to be true
                  end
                end

                context "when the piece shares an edge with the same colour" do
                  # Z identity 7 5
                  let(:coordinates) { [Point.new(7, 5), Point.new(7, 6), Point.new(8, 6), Point.new(8, 7)] }

                  it "the move is rejected" do
                    expect(subject).to be false
                  end
                end
              end
                
              context "when the piece does not touch an any corners of the same colour" do
                # V3 rotate_90_clockwise 4 4
                let(:coordinates) { [Point.new(5, 4), Point.new(4, 5), Point.new(5, 5)] }

                it "the move is rejected" do
                  expect(subject).to be false
                end
              end
            end
          end

          context "when the squares covered by the piece are not empty" do
            # 2 identity 3 2
            let(:coordinates) { [Point.new(3, 2), Point.new(3, 3)] }

            it "rejects the move" do
              expect(subject).to be false
            end
          end
        end

        context "when the piece has been used" do
          # T4 rotate_90_anticlockwise x=0 y=4
          let(:coordinates) { [Point.new(0, 4), Point.new(0, 5), Point.new(1, 5), Point.new(0,6)] }

          before do 
            game.turns.play_order.offset(12).each { |turn| turn.destroy! }
          end

          it "rejects the move" do
            expect(subject).to be false
          end
        end
      end

      context "when the piece is not recognised" do
        let(:coordinates) { [Point.new(1, 19), Point.new(2, 19),  Point.new(2, 18), Point.new(3, 18), Point.new(2, 17), Point.new(4, 18)] }

        it "rejects the move" do
          expect(subject).to be false
        end
      end
    end

    context "when a piece is off the board" do
      let(:coordinates) { [Point.new(11, 56)] }
      
      it "rejects the move" do
        expect(subject).to be false
      end
    end
  end
end