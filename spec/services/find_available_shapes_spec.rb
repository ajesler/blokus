require "rails_helper"

RSpec.describe FindAvailableShapes do
  fixtures :all

  describe "#call" do
    let(:player) { players(:one) }
    let(:find_available_shapes) { FindAvailableShapes.new(player) }
    let(:available_shapes) { find_available_shapes.call }

    context "with no shapes played" do
      before do
        player.game.turns.each { |turn| turn.destroy! }
      end

      it "returns 21 shapes" do
        expect(player.game.shapes.size).to eq 21
        expect(available_shapes.size).to eq player.game.shapes.size
      end
    end

    context "when some shapes have been played" do
      before do
        player.game.turns.each { |turn| turn.destroy! }
        %w(F P X 2 I3).each do |name|
          player.turns.create(shape: name, transform: "identity", x: 0, y: 0)
        end
      end

      it "does not include the played shapes in the result" do
        expect(available_shapes.size).to eq 16
        available_shape_names = available_shapes.map { |shape| shape.name }
        %w(F P X 2 I3).each do |name|
          expect(available_shape_names.include?(name)).to be false
        end
      end
    end

    context "when all pieces have been played" do
      before do
        player.game.turns.each { |turn| turn.destroy! }
        player.game.shapes.collect(&:name).each do |name|
          player.turns.create(shape: name, transform: "identity", x: 0, y: 0)
        end
      end

      it "returns an empty list" do
        expect(available_shapes.size).to eq 0
      end
    end
  end
end