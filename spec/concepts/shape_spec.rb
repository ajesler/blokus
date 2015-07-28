require 'rails_helper'

RSpec.describe Shape do

  describe "#size" do
    let(:name) { :test_shape }
    let(:definition) { Matrix[[1, 1, 2, 0, 1],[0, 1, 1, 2, 2]] }
    let(:shape) { Shape.new(name, definition) }
  
    subject { shape.size }

    it "should return the number of squares in the shape" do
      is_expected.to eq 5
    end
  end

  describe "#isomers" do
    let(:x) { Shape.new("X", Matrix[[0, 1, 1, 2, 1], [1, 0, 1, 1, 2]]) }
    let(:one) { Shape.new("1", Matrix[[0],[0]]) }
    let(:i3) { Shape.new("I3", Matrix[[0, 0, 0],[0, 1, 2]]) }
    let(:f) { Shape.new("F", Matrix[[1, 1, 2, 0, 1],[0, 1, 1, 2, 2]]) }
    let(:y) { Shape.new("Y", Matrix[[0, 0, 0, 1, 0],[0, 1, 2, 2, 3]]) }
    let(:shapes) { [[x, 1], [one, 1], [i3, 2], [f, 8], [y, 8]] }

    it "correctly calculates all isomers for various shapes" do
      shapes.each do |shape, expected_isomer_count|
        expect(shape.isomers.size).to eq expected_isomer_count
      end
    end
  end
end