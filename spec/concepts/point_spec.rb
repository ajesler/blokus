require 'rails_helper'

RSpec.describe Point do
  describe ".from_string" do
    it "parses a comma separated string correctly" do
      point = Point.from_string("3,4")

      expect(point.x).to eq 3
      expect(point.y).to eq 4
    end

    it "returns nil when given invalid point string" do 
      point = Point.from_string("5,6,7,8")

      expect(point).to be_nil
    end
  end

  describe ".from_string!" do
    context "with an input_string that has less than two coordinates" do
      it "raises an ArgumentError" do
        expect { Point.from_string!("10") }.to raise_error(ArgumentError)
        expect { Point.from_string!("3,") }.to raise_error(ArgumentError)
      end
    end
  end

  describe "#to_s" do
    let(:point) { Point.new(2,3) }
    
    it "outputs x,y" do 
      expect(point.to_s).to eq "2,3"
    end
  end
end