require 'rails_helper'

RSpec.describe Turn, type: :model do
	let(:player) { Player.new }
	let(:shape_name) { Shapes.names.first }
	let(:transform_name) { Transforms.names.first }
	let(:x) { 1 }
	let(:y) { 1 }
	let(:turn) { Turn.new(player: player, shape: shape_name, transform: transform_name, x: x, y: y) }

	subject { turn }

	context "with no shape or transform" do
		let(:transform_name) { nil }
		let(:shape_name) { nil }

		it { is_expected.to be_pass }

		context "with nil x and y values" do
			let(:x) { nil }
			let(:y) { nil }

			it { is_expected.to be_valid }
		end

		context "with non-nil x and y values" do
			it { is_expected.to_not be_valid }
		end
	end

	context "with both a shape and a transform" do
		it { is_expected.to_not be_pass }
		
		context "with non-nil x and y values that are on the board" do
			it { is_expected.to be_valid }
		end

		context "with non-nil x and y values that are off the board" do
			let(:x) { Board::DEFAULT_SIZE * 10 }
			let(:y) { Board::DEFAULT_SIZE * 10 }

			it { is_expected.to_not be_valid }
		end

		context "with nil x and y values" do
			let(:x) { nil }
			let(:y) { nil }

			it { is_expected.to_not be_valid }
		end
	end

	context "with a shape but not a transform" do
		let(:transform_name) { nil }

		it { is_expected.to_not be_valid }
	end

	context "with no shape but has a transform" do
		let(:shape_name) { nil }

		it { is_expected.to_not be_valid }
	end

  describe "#shape" do
  	subject { turn.shape }

  	context "with an invalid shape name" do
  		let(:shape_name) { "pan galactic gargle blaster" }

  		it { expect(turn).to_not be_valid }
  	end
  end

  describe "#transform" do
  	subject { turn.transform }

  	context "with an invalid shape name" do
  		let(:transform_name) { "pan galactic gargle blaster" }

  		it { expect(turn).to_not be_valid }
  	end
  end
end
